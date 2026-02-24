'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';

export interface ChartDataPoint {
    day: string;
    tokens: number;
    projected?: number;
}

interface TokenUsageChartCardProps {
    data: ChartDataPoint[];
    isLoading?: boolean;
}

export function TokenUsageChartCard({ data, isLoading }: TokenUsageChartCardProps) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-2xl" />;
    }

    return (
        <div className="h-full flex flex-col justify-between rounded-2xl p-5 glass-obsidian">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">Token Consumption</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daily usage vs projection</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="h-[200px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.15} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#93c5fd"
                            strokeWidth={2}
                            fill="none"
                            strokeDasharray="5 5"
                        />
                        <Area
                            type="monotone"
                            dataKey="tokens"
                            stroke="#2563eb"
                            fillOpacity={1}
                            fill="url(#colorTokens)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
