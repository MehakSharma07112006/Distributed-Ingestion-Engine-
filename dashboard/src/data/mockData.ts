import { DashboardData } from '../types';

// Generate timestamps for the last 24 hours, one per hour
const generateTimeSeriesData = (hours = 24, baseValue = 100, volatility = 0.3) => {
  const now = new Date();
  const data = [];
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    // Generate a somewhat random value that follows a trend
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = Math.round(baseValue * randomFactor);
    data.push({ timestamp, value });
  }
  
  return data;
};

// Generate total notifications data
const generateNotificationsData = (hours = 24) => {
  const now = new Date();
  const data = [];
  
  let cumulativeCount = 0;
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    // Random count between 5 and 25
    const count = Math.floor(Math.random() * 20) + 5;
    cumulativeCount += count;
    
    data.push({ timestamp, count });
  }
  
  return data;
};

// Mock data for the dashboard
export const mockDashboardData: DashboardData = {
  api_active:false,
  processors: [
    {
      id: 'proc-kafka',
      name: 'Kafka Service',
      status: 'active',
      metrics: generateTimeSeriesData(24, 150, 0.2)
    },
    {
      id: 'proc-redis',
      name: 'Redis Service',
      status: 'active',
      metrics: generateTimeSeriesData(24, 250, 0.3)
    },
  ],
  notifications: []
};