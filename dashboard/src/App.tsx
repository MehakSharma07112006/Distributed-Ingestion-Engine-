import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockDashboardData } from "@/data/mockData";
import { useEffect, useState } from "react";
import { DashboardData } from "./types";
import { set } from "date-fns";
// import { Toaster } from '@/components/ui/toaster';

function App() {
  const [mockData, setMockData] = useState<DashboardData>(mockDashboardData);
  const [metrics, setMetrics] = useState<
    | {
        queueSize: number;
        redisStatus: { id: "proc-redis"; status: boolean | undefined };
        kafkaStatus: { id: "proc-kafka"; status: boolean | undefined };
      }
    | undefined
  >(undefined);
  const [api_active, setApiActive] = useState<boolean | undefined>(false);

  async function fetchMetrics(): Promise<
    | {
        queueSize: number;
        api_active: boolean | undefined;
        redisStatus: {id:string, status: boolean | undefined};
        kafkaStatus:  {id:string, status: boolean | undefined};
      }
    | undefined
  > {
    try {
      const response = await fetch("http://localhost:3000/metrics");
      const data = await response.json();
      if (data.error) {
        console.error("[ERROR] Error in fetching metrics: ", data.message);
        return {
          queueSize: 0,
          api_active: false,
          redisStatus: {id:'proc-redis', status:false},
          kafkaStatus: {id:'proc-kafka', status:false},
        };
      }
      console.log("[INFO] Metrics fetched: ", data.metrics);
      return { ...data.metrics, api_active: true };
      // Here we can add the logic to update the dashboard with the metrics
    } catch (err) {
      console.error("[ERROR] Error in fetching metrics: ", err);
      return {
        queueSize: metrics?.queueSize ?? 0,
        api_active: false,
        redisStatus: {id:'proc-redis', status:false},
        kafkaStatus: {id:'proc-kafka', status:false},
      };
    }
  }

  // Fetch metrics every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics().then((metrics) => {
        if (!metrics) return;

        setMetrics(metrics);
        setApiActive(metrics.api_active);
        setMockData((prevState: DashboardData) => ({
          ...prevState,
          processors: prevState.processors.map((processor) => ({
            ...processor,
            status: metrics.kafkaStatus ? "active" : "inactive",
          })),
          notifications: [
            ...prevState.notifications,
            {
              timestamp: new Date(Date.now()).toISOString(),
              count: metrics.queueSize, // Use actual metric
            },
          ],
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DashboardLayout data={mockData} api_active={api_active || false} />
      {/* <Toaster /> */}
    </>
  );
}

export default App;
