'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemHealthCardProps {
    score?: number; // 0-100
    isLoading?: boolean;
}

export function SystemHealthCard({ score = 98, isLoading }: SystemHealthCardProps) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-2xl" />;
    }

    const data = [{ name: 'Health', value: score, fill: '#10b981' }];

    return (
        <div className="h-full flex flex-col justify-between rounded-2xl p-5 glass-obsidian">
            <div className="mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">System Health</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time status monitor</p>
            </div>

            <div className="relative flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={15}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={30} // Use number instead of boolean
                            fill="#10b981"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 top-10 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{score}%</span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm">Operational</span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">API Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Vector DB</span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Latency</span>
                </div>
            </div>
        </div>
    );
}
