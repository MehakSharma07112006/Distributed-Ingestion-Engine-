import { Consumer, KafkaMessage } from "kafkajs";
import { kafkaClient } from "./client";


async function createConsumer(topic: string, groupId: string) {
  const consumer = kafkaClient.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  return consumer;
}

async function consumeMessage(consumer:Consumer,callback: (message: any) => void) {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[INFO] Consumed message from topic: ${topic}`);
      // console.log("Actual Message:",{
      //       key: message.key?.toString(),
      //       value: message.value?.toString(),
      //       headers: message.headers,
      //   })
      callback(message.value?.toString());
    },
  });
}


export {consumeMessage, createConsumer };