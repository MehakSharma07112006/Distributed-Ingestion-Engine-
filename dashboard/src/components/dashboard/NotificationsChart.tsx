import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationData } from '@/types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';

interface NotificationsChartProps {
  data: NotificationData[];
  api_active?:boolean;
}

export function NotificationsChart({ data, api_active }: NotificationsChartProps) {
  const chartData = data.map(item => ({
    timestamp: item.timestamp,
    count: item.count,
    formattedTime: format(parseISO(item.timestamp), 'HH:mm'),
    formattedDate: format(parseISO(item.timestamp), 'MMM dd')
  }));

  // Calculate total notifications
  const totalNotifications = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate percentage change (last hour vs. average)
  const lastHourCount = chartData.length > 0 ? chartData[chartData.length - 1].count : 0;
  const averageCount = totalNotifications / chartData.length;
  const percentChange = averageCount > 0 
    ? Math.round(((lastHourCount - averageCount) / averageCount) * 100) 
    : 0;

  return (
    <Card className="transition-all hover:shadow-md py-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications Overview
            </CardTitle>
            <CardDescription>Total notifications processed over time</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Now in Queue</p>
              <p className="text-xl font-bold">{data[data.length - 1]?.count ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">API Status</p>
              <div className="flex items-center gap-1">
                {api_active ? (
                  <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm font-medium">Active</p> 
                  </>
                ) : (
                  <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-sm font-medium">Inactive</p> 
                  </>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNotifications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="formattedTime" 
                label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis 
                label={{ value: 'Notifications', angle: -90, position: 'insideLeft', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-3 rounded-md shadow-sm">
                        <p className="text-sm font-medium">
                          {format(parseISO(payload[0].payload.timestamp), 'MMMM dd, yyyy HH:mm')}
                        </p>
                        <p className="text-base font-bold mt-1">
                          Notifications: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorNotifications)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}