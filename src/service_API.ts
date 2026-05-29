// This is the main notification service file
// This file contains the main logic for the notifications service
// This is going to be an express server

import express, { Request, Response } from "express";
import cors from "cors";
import { checkKafkaServiceStatus, createTopic, kafkaClient } from "./kafka/client";
import { produceMessage } from "./kafka/producer";
import { consumeMessage } from "./kafka/consumer";
import { startAPIProcessor } from "./service_PROCESSOR";
import { startEmailProcessor } from "./channel_processors/emailProcessor";
import { Notification, NotificationSchema } from "./notification_types";
import RedisManager from "./redis/redisManager";
import redisClient from "./redis/client";
import { startSMSProcessor } from "./channel_processors/smsProcessor";
import * as dotenv from 'dotenv';
import { METRIC_KEYS } from "./redis/metris_keys";
dotenv.config();


// initialize the express app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//start the redis client
redisClient.connect().then(() => {
  console.log("[RedisManager] Redis client connected");
}).catch((err) => {
  console.error("[RedisManager] Error connecting to redis client: ", err);
});

// Initialize the kafka topics whenever the service starts
// Initial queue for async processing of notifications
createTopic("notifications.incoming", 1, 1);
// final pub/sub before the channel processors
createTopic("notifications.channel.email", 3, 1);
createTopic("notifications.channel.sms", 3, 1);
createTopic("notifications.channel.push", 3, 1);
createTopic("notifications.channel.webhook", 3, 1);


// start the service processor and channel processors
startAPIProcessor();
startEmailProcessor();
startSMSProcessor();

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});


// Look for notification ingestions from this endpoint
app.post("/ingest-notifications", (async (req: Request, res: Response) => {
  try {
    const { notifications }:{notifications:Notification[]} = req.body;
    const notificationStatusCount = {success:0, failed:0}
    if (!notifications) {
      return res
        .status(400)
        .json({ error: true, message: "No Notifications to be pushed received!" });
    }
    // Here we can add the logic to process the notification
    // For now we are just going to log the notification
    // console.log("[INFO] Notification ingested: ", notification);

    // Add the notification to the kafka queue to be processed by the service processor.
    notifications.forEach((notification: Notification) => {
      const isValidNotification = NotificationSchema.safeParse(notification)
      if (!isValidNotification.success)
      {
        notificationStatusCount.failed += 1;
        return;
      }
      console.log("[INFO] Notification ingested: ", notification);
      produceMessage("notifications.incoming", JSON.stringify(notification), 0);
      redisClient.increment(METRIC_KEYS.MAINQUEUE.QUEUE_SIZE, notifications.length)
      notificationStatusCount.success += 1;
    })

    if (notificationStatusCount.success == 0)
    {
      res.status(400).json({ error: true, message: "No valid notifications to be pushed received!" });
      return;
    }
    res.status(200).json({ error: false, message: "Notification ingested", status: {reason:"Invalid Structure!", ...notificationStatusCount} });
  } catch (err) {
    console.error("[ERROR] Error in ingesting notification: ", err);
    res
      .status(500)
      .json({ error: true, message: "Error in ingesting notification" });
  }
}) as express.RequestHandler);

// metric api endpoint
app.get("/metrics", async (req: Request, res: Response) => {
  try {
    const queueSize = await redisClient.get(METRIC_KEYS.MAINQUEUE.QUEUE_SIZE);
    // check kafka status
    const kafkaStatus = await checkKafkaServiceStatus();
    const redisStatus = await redisClient.checkRedisStatus();
    const metrics = {
      queueSize: queueSize ? parseInt(queueSize) : 0,
      kafkaStatus: kafkaStatus,
      redisStatus: redisStatus,
    };
    res.status(200).json({ error: false, metrics });
  } catch (err) {
    console.error("[ERROR] Error in getting metrics: ", err);
    res.status(500).json({ error: true, message: "Error in getting metrics" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Notifications service is running on port ${PORT}`);
});
