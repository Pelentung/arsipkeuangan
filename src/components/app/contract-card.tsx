'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contract } from '@/lib/types';
import { FileText, Users, CalendarClock } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const endDate = new Date(contract.endDate);
  const isExpired = isPast(endDate);

  const ExpiryInfo = () => {
    if (isExpired) {
      return <span className="text-destructive">Expired</span>;
    }
    return (
      <span className="text-amber-600">
        Expires in {formatDistanceToNow(endDate, { addSuffix: false })}
      </span>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold leading-tight pr-4">{contract.title}</CardTitle>
            <div className="flex-shrink-0 p-2 rounded-full bg-accent/10 text-accent">
                <FileText className="w-5 h-5" />
            </div>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1 text-sm">
            <Users className="w-4 h-4" /> 
            <span>{contract.parties.join(', ')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{contract.summary}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            <span>{format(endDate, 'MMM d, yyyy')}</span>
        </div>
        <ExpiryInfo />
      </CardFooter>
    </Card>
  );
}

export default ContractCard;
