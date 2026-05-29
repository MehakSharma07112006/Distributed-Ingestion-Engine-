import { KafkaMessage } from "kafkajs";
import { consumeMessage, createConsumer } from "../kafka/consumer";
import { Notification } from "../notification_types";


export async function startSMSProcessor()
{
    const smsConsumer = await createConsumer("notifications.channel.sms", "sms-processor");
    console.log("[INFO] SMS processor started");
    await consumeMessage(smsConsumer, async (message:any)=>{
        console.log("[INFO] Processing message from notifications.channel.sms");
        const notification:Notification = JSON.parse(message || "{}");

        // extraact the sms content here and send it through the channel.
        const smsContent = notification.message.sms?.text;
        const smsChannel = notification.channel_info;
        if (!smsContent || !smsChannel) {
            console.error("[ERROR] SMS content or channel info not found");
            return;
        }
        // Here we can add the logic to process the notification
        console.log("[INFO] Notification processed: ", notification);
        console.log("[INFO] SMS content: ", smsContent);

    }
    )
    .catch((err) => {
        console.error("[ERROR] Error in sending notification to channel processor: ", err);
    }
    )
}