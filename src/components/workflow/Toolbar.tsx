import React from 'react';
import { Play, Save, Eye, MousePointer2, Plus, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useWorkflowStore } from './store';
import { toast } from 'sonner';
import { useReactFlow } from 'reactflow';

interface ToolbarProps {
    mobileMode?: 'view' | 'edit';
    setMobileMode?: (mode: 'view' | 'edit') => void;
    setIsSidebarOpen?: (open: boolean) => void;
}

export function Toolbar({ mobileMode, setMobileMode, setIsSidebarOpen }: ToolbarProps) {
    const { meta, executeWorkflow, publishVersion } = useWorkflowStore();
    const { fitView } = useReactFlow();

    const handleRun = async () => {
        // Trigger Async Backend Execution
        await executeWorkflow();
    };

    const handlePublish = () => {
        const oldVersion = meta.version;
        publishVersion();
        toast.success("Workflow Published", {
            description: `Promoted v${oldVersion} → Production Snapshot`,
        });
    };

    return (
        <>
            {/* DESKTOP TOOLBAR (Top Right) */}
            <div className="hidden md:flex absolute top-4 right-4 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md p-2 rounded-lg border border-slate-200 dark:border-blue-900/30 shadow-sm z-10 items-center gap-2 glass-obsidian">
                <div className="px-3 py-1 flex flex-col items-end mr-2 border-r border-slate-100 dark:border-blue-900/30 pr-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.status === 'published' ? 'text-green-600 dark:text-green-500' : 'text-amber-500 dark:text-amber-400'}`}>
                        {meta.status}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">v{meta.version}</span>
                </div>

                <Button variant="outline" size="sm" onClick={handlePublish} className="h-8 gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-500/50 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                    <Save className="h-3.5 w-3.5" />
                    Publish
                </Button>

                <Button size="sm" onClick={handleRun} className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Run
                </Button>
            </div>

            {/* MOBILE FLOATING TOOLBAR (Bottom Center) */}
            <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2 rounded-full bg-slate-900/90 backdrop-blur-md shadow-2xl border border-slate-700/50 text-white" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>

                {/* Mode Toggle */}
                <div className="flex bg-slate-800 rounded-full p-1 mr-2">
                    <button
                        onClick={() => setMobileMode?.('view')}
                        className={`p-2 rounded-full transition-all ${mobileMode === 'view' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setMobileMode?.('edit')}
                        className={`p-2 rounded-full transition-all ${mobileMode === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <MousePointer2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Actions (Only enabled in Edit mode or universal) */}
                <div className="h-6 w-px bg-slate-700 mx-1" />

                <button
                    onClick={() => setIsSidebarOpen?.(true)}
                    disabled={mobileMode === 'view'}
                    className={`p-2 rounded-full transition-all ${mobileMode === 'edit' ? 'bg-white text-slate-900 hover:bg-blue-50' : 'opacity-30 cursor-not-allowed text-slate-400'}`}
                >
                    <Plus className="h-5 w-5" />
                </button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRun}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-full h-9 w-9"
                >
                    <Play className="h-5 w-5 fill-current" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => fitView({ padding: 0.2 })}
                    className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-9 w-9"
                >
                    <Maximize className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}
