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
    nilai: number;
    realisasi: number;
}

interface ContractStatusChartProps {
    data: ChartData[];
}

const chartConfig = {
  nilai: {
    label: 'Nilai',
    color: 'hsl(var(--chart-2))',
  },
  realisasi: {
    label: 'Realisasi',
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
           <YAxis 
            allowDecimals={false}
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}
           />
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value, name) => `${name}: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)}`} />}
            cursor={false}
          />
          <Legend />
          <Bar dataKey="nilai" fill="var(--color-nilai)" radius={4} />
          <Bar dataKey="realisasi" fill="var(--color-realisasi)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
