
// Producer for the kafka broker

import { kafkaClient } from "./client";

const producer = kafkaClient.producer()

async function produceMessage(topic:string, message:string, partition:number = 0)
{
    console.log("[INFO] Producing message to topic: ", topic);
    // console.log("[INFO] Message: ", message);
    await producer.connect();
    await producer.send({
        topic: topic,
        messages:[
            { key:'notification',value: message, partition: partition }
        ]
    })
}

export { producer, produceMessage };