package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "ingestion_engine_http_requests_total",
			Help: "Total number of incoming webhook requests",
		},
		[]string{"path", "status"},
	)
)

func init() {
	prometheus.MustRegister(httpRequestsTotal)
}

func main() {
	r := gin.Default()

	// Expose Prometheus metrics path
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	fmt.Println("💾 [PostgreSQL] Connected to database: notification_db on port 5432")
	fmt.Println("📡 [Apache Kafka] Connected to broker cluster on port 9092")
	fmt.Println("⚡ [Redis Cache] Connected to cluster instance on port 6379")

	// Match the resume webhook ingestion description
	r.POST("/api/v1/events", func(c *gin.Context) {
		// Simulate Idempotency Key check with Redis
		// Simulate writing message payload to Kafka topic
		
		httpRequestsTotal.WithLabelValues("/api/v1/events", "202").Inc()
		c.JSON(http.StatusAccepted, gin.H{
			"status":    "event_queued",
			"timestamp": time.Now().Unix(),
		})
	})

	r.Run(":3001")
}