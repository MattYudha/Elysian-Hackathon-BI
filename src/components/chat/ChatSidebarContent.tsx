import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus } from 'lucide-react';

interface ChatSidebarContentProps {
    onSelectChat?: (chat: string) => void;
}

export function ChatSidebarContent({ onSelectChat }: ChatSidebarContentProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/20 dark:border-blue-900/30 flex items-center justify-between">
                <span className="font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-200">Riwayat Percakapan</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/40 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                    <MessageSquarePlus className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                    {['Perencanaan Proyek Elysian', 'Bantuan Komponen React', 'Desain Skema Database'].map((chat, i) => (
                        <button
                            key={i}
                            onClick={() => onSelectChat?.(chat)}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors truncate text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
                        >
                            {chat}
                        </button>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/20 dark:border-blue-900/30 mt-auto">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online</span>
                </div>
            </div>
        </div>
    );
}
