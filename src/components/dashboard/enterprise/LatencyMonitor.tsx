'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, AlertCircle, CheckCircle } from 'lucide-react';
import type { LatencyMetric } from '@/types/api-responses';

interface LatencyMonitorProps {
    data: LatencyMetric[];
    isLoading?: boolean;
}

export function LatencyMonitor({ data, isLoading }: LatencyMonitorProps) {
    if (isLoading) {
        return <Skeleton className="h-[320px] w-full rounded-2xl" />;
    }

    const currentP95 = data[data.length - 1]?.p95 || 0;
    const currentP99 = data[data.length - 1]?.p99 || 0;
    const status = currentP95 < 200 ? 'healthy' : currentP95 < 500 ? 'degraded' : 'critical';

    return (
        <div className="rounded-2xl p-6 glass-obsidian">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">MLOps Performance</h3>
                        {status === 'healthy' && (
                            <span className="flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <CheckCircle className="mr-1 h-3 w-3" /> Healthy
                            </span>
                        )}
                        {status !== 'healthy' && (
                            <span className="flex items-center rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                <AlertCircle className="mr-1 h-3 w-3" /> Degradation
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">End-to-end inference latency (ms)</p>

                    <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">p95 Latency</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{currentP95}ms</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">p99 Latency</p>
                            <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">{currentP99}ms</p>
                        </div>
                    </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid vertical={false} strokeOpacity={0.05} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickFormatter={(value) => `${value}ms`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'var(--foreground)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="p95"
                            name="p95 (Typical)"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="p99"
                            name="p99 (Outliers)"
                            stroke="#cbd5e1"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
