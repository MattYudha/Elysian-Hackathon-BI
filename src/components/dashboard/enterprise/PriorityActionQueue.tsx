'use client';


import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timestamp: string;
    type: 'pipeline' | 'system' | 'billing';
}

interface PriorityActionQueueProps {
    actions?: ActionItem[];
    isLoading?: boolean;
}

export function PriorityActionQueue({ actions = [], isLoading }: PriorityActionQueueProps) {
    if (isLoading) {
        return <Skeleton className="h-64 w-full rounded-2xl" />;
    }

    // Mock data if empty
    const items = actions.length > 0 ? actions : [
        { id: '1', title: 'Pipeline #42 Failed', description: 'Data ingestion timeout', priority: 'high', timestamp: '2m ago', type: 'pipeline' },
        { id: '2', title: 'Token Limit Reached', description: 'Upgraded to Tier 2 automatically', priority: 'medium', timestamp: '1h ago', type: 'billing' },
        { id: '3', title: 'System Update', description: 'Scheduled maintenance in 24h', priority: 'low', timestamp: '4h ago', type: 'system' },
    ] as ActionItem[];

    return (
        <div className="rounded-2xl p-5 glass-obsidian">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Priority Queue</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {items.length} Active
                </span>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="group flex gap-3">
                        <div className={cn(
                            "mt-1 flex h-2 w-2 shrink-0 rounded-full ring-2 ring-offset-2",
                            item.priority === 'high' ? "bg-rose-500 ring-rose-100" :
                                item.priority === 'medium' ? "bg-amber-500 ring-amber-100" :
                                    "bg-blue-500 ring-blue-100"
                        )} />

                        <div className="min-w-0 flex-1 border-b border-slate-100 dark:border-slate-800/50 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                                <h4 className="truncate text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.timestamp}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-2 w-full text-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                View all activity
            </button>
        </div>
    );
}
