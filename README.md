# 🚀 High-Throughput Distributed Notification Engine with Live Telemetry

A production-grade, decoupled microservice architecture engineered to safely ingest, queue, cache, and dispatch multi-channel communications (Email, SMS, Push, and Webhooks) at high throughput. 

By replacing tightly coupled HTTP chains with an asynchronous **Apache Kafka distributed streaming platform**, the service isolates high-volume API ingestion from slow network I/O during downstream delivery. It leverages **Redis** for sub-millisecond idempotency caching and features full telemetry instrumentation via **Prometheus and Grafana**.

---

## 📊 System Architecture

The infrastructure is completely containerized and split into modular layers to prevent single-point-of-failure bottlenecks:

1. **Ingestion API Gateway:** A lightweight Node.js & TypeScript service running Express. It enforces strict structural contract validation using Zod schemas before acknowledging requests.
2. **Distributed Message Broker (Apache Kafka & Zookeeper):** Buffers incoming spikes into dedicated, partitioned channels (`notifications.incoming`, email, sms, push, webhooks). This prevents heavy traffic from crashing downstream providers.
3. **Idempotency Engine (Redis):** Tracks incoming payload signatures in-memory to discard duplicate client requests and mitigate redundant delivery overhead.
4. **Telemetry Pipeline (Prometheus + Grafana):** Dynamically scrapes service health and route metrics via an exposed telemetry endpoint, surfacing live visualization panels.

---

## 🏗️ Technical Stack

* **Runtime Environment:** Node.js, TypeScript (Engineered with strict type safety)
* **Event Streaming & Buffering:** Apache Kafka v7.6 (Confluent Platform Wrapper)
* **Coordination Engine:** Apache ZooKeeper
* **Caching & Distributed State:** Redis v7.0 (High-Speed Key-Value Cache)
* **Telemetry & Scraping:** Prometheus v2.45
* **Analytics Visualization Dashboard:** Grafana v10.2
* **Data Guard & Structural Contract:** Zod Schema Validation

---

## ⚡ Key Engineering Upgrades Added

* **Decoupled Asynchronous Workflows:** Shifted from synchronized blocking APIs to an event-driven model. If the email channel fails or experiences third-party latency, the SMS and Webhook worker pipelines continue to execute smoothly.
* **Production Observability Pipeline:** Fully instrumented native application codebases using `prom-client` to expose metric tracking (`/metrics`). Tracks total traffic, endpoint pathways, and maps error states (`200`, `404`, `500`) directly to Grafana charts.
* **Resilient Infrastructure Architecture:** Orchestrated the entire complex backing matrix entirely within Docker. Developers can boot up detached broker clusters and monitoring suites with a single, unified execution block.

---

## 🚀 Setup & Execution Manual

### Prerequisites
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) started and active on your machine.

### 1. Boot up the Distributed Infrastructure
Spin up the background network layout including message queues, cache clusters, telemetry scrapers, and analytics interfaces:
```bash
docker-compose up -d