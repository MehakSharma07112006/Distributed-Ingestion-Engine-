import { DashboardData } from '@/types';
import { DashboardHeader } from './DashboardHeader';
import { NotificationsChart } from './NotificationsChart';
import { ProcessorChart } from './ProcessorChart';
import { StatusCard } from './StatusCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardLayoutProps {
  data: DashboardData;
  api_active: boolean;
}

export function DashboardLayout({ data, api_active }: DashboardLayoutProps) {
  const activeProcessors = data.processors.filter(p => p.status === 'active');
  const inactiveProcessors = data.processors.filter(p => p.status === 'inactive');
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Main notification chart */}
        <NotificationsChart data={data.notifications} api_active={api_active}/>
        
        {/* Processor status summary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Processor Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.processors.map(processor => (
              <StatusCard key={processor.id} processor={processor} />
            ))}
          </div>
        </div>
        
        {/* Processor detailed charts */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Processor Metrics</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Processors</TabsTrigger>
              <TabsTrigger value="active">
                Active <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full px-1.5 py-0.5">{activeProcessors.length}</span>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive <span className="ml-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full px-1.5 py-0.5">{inactiveProcessors.length}</span>
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="w-full">
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.processors.map(processor => (
                    <ProcessorChart key={processor.id} processor={processor} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeProcessors.map(processor => (
                    <ProcessorChart key={processor.id} processor={processor} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="inactive" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactiveProcessors.map(processor => (
                    <ProcessorChart key={processor.id} processor={processor} />
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </main>
    </div>
  );
}