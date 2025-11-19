'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartConfig } from '@/components/ui/chart';

interface ChartData {
    month: string;
    active: number;
    expiringSoon: number;
    expired: number;
}

interface ContractStatusChartProps {
    data: ChartData[];
}

const chartConfig = {
  active: {
    label: 'Aktif',
    color: 'hsl(var(--chart-2))',
  },
  expiringSoon: {
    label: 'Akan Berakhir',
    color: 'hsl(var(--chart-4))',
  },
  expired: {
    label: 'Kadaluarsa',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ContractStatusChart({ data }: ContractStatusChartProps) {
  if (!data || data.length === 0) {
    return (
        <div className="flex h-80 w-full items-center justify-center">
            <p className="text-muted-foreground">Tidak ada data untuk ditampilkan.</p>
        </div>
    );
  }
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
           <YAxis allowDecimals={false} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={false}
          />
          <Legend />
          <Bar dataKey="active" fill="var(--color-active)" radius={4} stackId="a" />
          <Bar dataKey="expiringSoon" fill="var(--color-expiringSoon)" radius={4} stackId="a" />
          <Bar dataKey="expired" fill="var(--color-expired)" radius={4} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
