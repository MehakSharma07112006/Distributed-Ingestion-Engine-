import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Processor } from '@/types';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProcessorChartProps {
  processor: Processor;
  className?: string;
}

export function ProcessorChart({ processor, className }: ProcessorChartProps) {
  const isActive = processor.status === 'active';
  const data = processor.metrics.map(metric => ({
    timestamp: metric.timestamp,
    value: metric.value,
    formattedTime: format(parseISO(metric.timestamp), 'HH:mm')
  }));

  // Calculate some statistics
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const average = Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length);

  return (
    <Card className={cn('transition-all hover:shadow-md h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {processor.name}
          </CardTitle>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : 
                     "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          )}>
            {isActive ? 'Online' : 'Offline'}
          </div>
        </div>
        <CardDescription>Processing metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Current</div>
            <div className="text-2xl font-bold">{latestValue}</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Average</div>
            <div className="text-2xl font-bold">{average}</div>
          </div>
        </div>
        
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${processor.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isActive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isActive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="formattedTime" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={30}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
                        <p className="text-xs font-medium">
                          {format(parseISO(payload[0].payload.timestamp), 'MMM dd, HH:mm')}
                        </p>
                        <p className="text-sm font-bold">
                          Value: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isActive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
                fillOpacity={1}
                fill={`url(#gradient-${processor.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}