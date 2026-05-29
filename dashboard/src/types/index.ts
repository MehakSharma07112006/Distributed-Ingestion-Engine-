export interface Processor {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  metrics: {
    timestamp: string;
    value: number;
  }[];
}

export interface NotificationData {
  timestamp: string;
  count: number;
}

export interface DashboardData {
  processors: Processor[];
  api_active:boolean;
  notifications: {timestamp: string; count: number}[];
}