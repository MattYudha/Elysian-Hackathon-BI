'use client';

import { Button } from '@/components/ui/button';
import { Plus, GripVertical, MoreHorizontal, Settings2 } from 'lucide-react';

export default function TypesPage() {
    const dataTypes = [
        { id: "task", name: "Task", description: "Standard unit of work", fields: 12, isSystem: true },
        { id: "project", name: "Project", description: "Container for tasks", fields: 8, isSystem: true },
        { id: "doc", name: "Document", description: "Rich text knowledge base", fields: 3, isSystem: true },
        { id: "custom1", name: "Client Brief", description: "Custom intake form", fields: 15, isSystem: false },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Data Types</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Customize the taxonomy of data that your workspace and AI agents recognize.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-2 hidden sm:flex">
                    <Plus className="h-4 w-4" />
                    New Type
                </Button>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span className="col-span-1"></span>
                    <span className="col-span-5">Type</span>
                    <span className="col-span-4 hidden sm:block">Classification</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {dataTypes.map((type) => (
                        <div key={type.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <div className="col-span-1 flex items-center">
                                <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />
                            </div>
                            <div className="col-span-9 sm:col-span-5 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900 dark:text-white">{type.name}</span>
                                    {type.isSystem && (
                                        <span className="px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                                            System
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500">{type.description}</span>
                            </div>
                            <div className="col-span-4 hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Settings2 className="h-4 w-4" />
                                {type.fields} custom fields
                            </div>
                            <div className="col-span-2 flex items-center justify-end">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button className="w-full sm:hidden border-dashed bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 gap-2">
                <Plus className="h-4 w-4" />
                New Type
            </Button>
        </div>
    );
}
