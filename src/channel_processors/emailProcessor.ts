import { KafkaMessage } from "kafkajs";
import { consumeMessage, createConsumer } from "../kafka/consumer";
import { Notification } from "../notification_types";
import { sendEmailNotification } from "../utils.ts/mailManager";
import redisClient from "../redis/client";
import { METRIC_KEYS } from "../redis/metris_keys";


export async function startEmailProcessor()
{
    const emailConsumer = await createConsumer("notifications.channel.email", "email-processor");
    console.log("[INFO] Email processor started");
    await consumeMessage(emailConsumer, async (message:any)=>{
        redisClient.decrement(METRIC_KEYS.MAINQUEUE.QUEUE_SIZE, 1);
        console.log("[INFO] Processing message from notifications.channel.email");
        const notification:Notification = JSON.parse(message || "{}");

        const emailContent = notification.message.email
        const emailChannel = notification.channel_info;
        if (!emailContent || !emailChannel) {
            console.error("[ERROR] Email content or channel info not found");
            return;
        }
        // Here we can add the logic to process the notification
        // console.log("[INFO] Notification processed: ", notification);
        console.log("[INFO] Email content: ", emailContent);

        await sendEmailNotification(emailChannel, emailContent.subject, emailContent.body )

    }
    )
    .catch((err) => {
        console.error("[ERROR] Error in sending notification to channel processor: ", err);
    }
    )
}