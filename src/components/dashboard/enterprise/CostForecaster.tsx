'use client';

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import type { CostMetric } from '@/types/api-responses';

interface CostForecasterProps {
    data: CostMetric[];
    isLoading?: boolean;
}

export function CostForecaster({ data, isLoading }: CostForecasterProps) {
    if (isLoading) {
        return <Skeleton className="h-[320px] w-full rounded-2xl" />;
    }

    const currentSpend = data.reduce((acc, curr) => acc + curr.amount, 0);
    const budgetLimit = data[0]?.budget || 5000;
    const projected = data[data.length - 1]?.projected || 0;
    const isOverBudget = projected > budgetLimit;

    return (
        <div className="rounded-2xl p-6 glass-obsidian">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Cost & Billing Intelligence</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time spend forecast vs budget</p>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Spend</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">${currentSpend.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Projected (EOM)</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-2xl font-bold ${isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-50'}`}>
                                    ${projected.toFixed(2)}
                                </p>
                                {isOverBudget && (
                                    <span className="flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        Over Budget
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <defs>
                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.05} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickFormatter={(value) => `$${value}`}
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
                            labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                        />
                        <Bar
                            dataKey="amount"
                            name="Daily Spend"
                            fill="url(#colorSpend)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                        <Line
                            type="monotone"
                            dataKey="projected"
                            name="Projected"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <ReferenceLine y={budgetLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Budget Limit', fill: '#ef4444', fontSize: 10 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
