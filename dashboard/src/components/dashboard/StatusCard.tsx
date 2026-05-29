import { Processor } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  processor: Processor;
  className?: string;
}

export function StatusCard({ processor, className }: StatusCardProps) {
  const isActive = processor.status === 'active';
  
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          {processor.name}
          <Badge 
            variant={isActive ? "default" : "destructive"}
            className={cn(
              "ml-2 transition-all duration-300",
              isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>Processor Status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {isActive ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-500 font-medium">Operational</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-500 font-medium">Not Responding</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}