'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contract } from '@/lib/types';
import { FileText, User, Calendar, Coins, Receipt, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const contractDate = new Date(contract.contractDate);
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };


  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold leading-tight pr-4">{contract.contractNumber}</CardTitle>
            <div className="flex-shrink-0 p-2 rounded-full bg-accent/10 text-accent">
                <FileText className="w-5 h-5" />
            </div>
        </div>
        <CardDescription className="flex flex-col gap-2 pt-1 text-sm">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 
                <span>{format(contractDate, 'd MMM yyyy', { locale: id })}</span>
            </div>
             <div className="flex items-center gap-2">
                <User className="w-4 h-4" /> 
                <span>{contract.implementer}</span>
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{contract.description}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex flex-col items-start gap-2">
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-600">
                <Coins className="w-4 h-4" />
                <span>{formatCurrency(contract.value)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
                <Receipt className="w-4 h-4" />
                <span>{formatCurrency(contract.realization)}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600">
                <Wallet className="w-4 h-4" />
                <span>{formatCurrency(contract.remainingValue)}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ContractCard;
