#!/bin/bash

echo "Waiting for Zookeeper to be healthy at zookeeper:2181..."

while ! nc -z zookeeper 2181; do
  echo "Zookeeper not ready yet. Sleeping..."
  sleep 2
done

echo "Zookeeper is up! Starting Kafka..."
/etc/confluent/docker/run
