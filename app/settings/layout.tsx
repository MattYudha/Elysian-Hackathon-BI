'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Lock, Bell, Palette, ChevronLeft, Settings, Users, ShieldCheck, Activity, CreditCard, Import, Bot, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants, Button } from '@/components/ui/button';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

const sidebarGroups = [
    {
        label: 'Personal',
        items: [
            { href: '/settings/profile', title: 'Account', icon: User },
            { href: '/settings/notifications', title: 'Notifications', icon: Bell },
            { href: '/settings/security', title: 'Security', icon: Lock },
            { href: '/settings/appearance', title: 'Appearance', icon: Palette },
        ]
    },
    {
        label: 'Workspace',
        items: [
            { href: '/settings/workspace/preferences', title: 'Preferences', icon: Settings },
            { href: '/settings/workspace/teammates', title: 'Teammates', icon: Users },
            { href: '/settings/workspace/identity', title: 'Identity', icon: ShieldCheck },
            { href: '/settings/workspace/types', title: 'Types', icon: Activity },
            { href: '/settings/workspace/billing', title: 'Plans and billing', icon: CreditCard },
            { href: '/settings/workspace/import', title: 'Import', icon: Import },
        ]
    },
    {
        label: 'AI',
        items: [
            { href: '/settings/ai/agents', title: 'Agents', icon: Bot },
            { href: '/settings/ai/skills', title: 'Skills', icon: Zap },
        ]
    }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full relative z-0">
            <ElysianGrid />
            {/* Background Base (Simulating the Dashboard behind the modal) */}
            <div className="hidden md:block sticky top-0 h-screen flex-none">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden">
                <DashboardNavbar />
                {/* Dummy background content so it's not empty behind blur */}
                <div className="flex-1 p-8 opacity-20 hidden md:block">
                    <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl"></div>
                </div>
            </main>

            {/* Modal Overlay / Popup */}
            {/* Removed backdrop-blur-[2px] fixed massive GPU performance drop on full screen overlays */}
            <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
                <div className="relative w-full max-w-[1040px] mx-auto bg-white dark:bg-[#0B1120] rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row overflow-hidden min-h-[75vh] md:min-h-[80vh] my-auto">

                    {/* Mobile Close Button (Absolute Top Right) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 rounded-full md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => router.push('/dashboard')}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    {/* Left Sidebar Pane */}
                    <aside className="w-full md:w-64 lg:w-[280px] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#060D18] flex flex-col flex-shrink-0">
                        {/* Sidebar Header Space */}
                        <div className="h-14 md:h-20" />

                        <nav className="flex-1 overflow-y-auto px-3 md:px-4 pb-8 flex flex-col gap-6 scrollbar-hide">
                            {sidebarGroups.map((group) => (
                                <div key={group.label} className="flex flex-col gap-1">
                                    <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-3">
                                        {group.label}
                                    </h4>
                                    <div className="flex flex-col gap-0.5">
                                        {group.items.map((item) => {
                                            const isActive = pathname.includes(item.href);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                                                        isActive
                                                            ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                                                    )}
                                                >
                                                    <item.icon className={cn("h-4 w-4", isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                                                    {item.title}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Right Content Pane */}
                    <main className="flex-1 flex flex-col bg-white dark:bg-[#0B1120] relative min-w-0">
                        {/* Desktop Close Button (Floating Top Right inside content) */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 hidden md:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => router.push('/dashboard')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scrollbar-hide">
                            <div className="max-w-[640px]">
                                {children}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
