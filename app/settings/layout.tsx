'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, Bell, Palette, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';


import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

const sidebarItems = [
    { href: '/settings/profile', title: 'Profil', icon: User },
    { href: '/settings/security', title: 'Keamanan', icon: Lock },
    { href: '/settings/appearance', title: 'Tampilan', icon: Palette },
    { href: '/settings/notifications', title: 'Notifikasi', icon: Bell },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen w-full relative z-0">
            <ElysianGrid />
            {/* Sidebar Sticky for Desktop */}
            <div className="hidden md:block sticky top-0 h-screen flex-none">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-h-screen relative w-full">
                {/* Navbar */}
                <div className="flex-none">
                    <DashboardNavbar staticMode />
                </div>

                <div id="main-scroll-container" className="flex-1 overflow-y-auto pb-16 md:pb-8">
                    {/* Original Settings Layout Content Wrapped Here */}
                    <div className="container max-w-6xl mx-auto space-y-8 relative p-4 md:p-6 lg:p-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
                            <p className="text-slate-500 dark:text-slate-400">Kelola akun dan preferensi Elysian Anda.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                            {/* Desktop Settings Sidebar */}
                            <aside className="hidden md:block w-[250px] flex-shrink-0">
                                <nav className="flex flex-col gap-1 sticky top-6">
                                    {sidebarItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                buttonVariants({ variant: 'ghost' }),
                                                "justify-start",
                                                pathname === item.href
                                                    ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-400"
                                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            )}
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    ))}
                                </nav>
                            </aside>

                            {/* Mobile Navigation (Horizontal Scroll) */}
                            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                                <div className="flex gap-2 min-w-max">
                                    {sidebarItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                                pathname === item.href
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                                    : "bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-blue-900/30"
                                            )}
                                        >
                                            <item.icon className="h-3.5 w-3.5" />
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Content Area */}
                            <main className="flex-1 min-w-0">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
