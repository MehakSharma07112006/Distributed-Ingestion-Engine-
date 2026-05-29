// this will consume messages from the queue and put them to the specific channel processor topics.

import { KafkaMessage } from "kafkajs";
import { consumeMessage, createConsumer } from "./kafka/consumer";
import { produceMessage } from "./kafka/producer";
import { Notification, UserChannelInfo, userChannelInfoSchema } from "./notification_types";
import redisClient from "./redis/client";

export async function startAPIProcessor() {
  try {
    const queueConsumer = await createConsumer(
      "notifications.incoming",
      "api-processor"
    );
    await consumeMessage(queueConsumer, async (message: string) => {
      console.log("[INFO] Processing message from notifications.incoming");
      const notification = JSON.parse(message) as Notification;
      console.log("[INFO] Notification: ", notification);
      //lets start with the notification processor, it fetches the relevant channel informations,
      // leave user preferences for now.
      //check in the redis client for channel info.
      const channelInfoString: string | null = await redisClient.get(
        "user:" + notification.userId + ":channelInfo"
      );
      let channelInfo: UserChannelInfo | null = channelInfoString
        ? JSON.parse(channelInfoString)
        : null;
      console.log("[INFO] Channel info from redis: ", channelInfo);

      if (!channelInfo) {
        // fetch from the endpoint given by the user and put it in the redis cache.
        console.log(
          "[INFO] Channel info not found in redis, fetching from endpoint."
        );
        const response = await fetch(
          `http://localhost:3001/api/user/${notification.userId}`
        );
        const data: { data: UserChannelInfo } = await response.json();
        const isValidInfo = userChannelInfoSchema.safeParse(data.data);
        if (isValidInfo.success) {
          channelInfo = data.data;
          // put it in the redis cache.
          await redisClient.set(
            "user:" + notification.userId + ":channelInfo",
            JSON.stringify(channelInfo),
            60*5 // 5 minutes expiry
          );
        }
      }

      // else modify the notification object to include the channel info.
      notification.channels?.forEach((channel: string) => {
        const key = `channel_${channel}` as keyof UserChannelInfo;
        produceMessage(
          "notifications.channel." + channel,
          JSON.stringify({
            ...notification,
            channel_info: channelInfo ? channelInfo[key] : null,
          })
        )
          .then(() => {
            console.log(
              "[INFO] Notification sent to channel processor: ",
              channel,
              ": ",
              notification
            );
          })
          .catch((err) => {
            console.error(
              "[ERROR] Error in sending notification to channel processor: ",
              err
            );
          });
      });
    });
  } catch (err) {
    console.error("[ERROR] Error in API processor: ", err);
  }
}
