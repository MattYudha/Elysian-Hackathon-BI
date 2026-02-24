'use client';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full relative z-0">
            <ElysianGrid />
            {/* Sidebar Sticky for Desktop */}
            <div className="hidden md:block sticky top-0 h-screen flex-none">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-h-screen relative w-full">
                {/* Navbar is strictly static here to push content down */}
                <div className="flex-none">
                    <DashboardNavbar staticMode />
                </div>

                <div id="main-scroll-container" className="flex-1 overflow-y-auto pb-16 md:pb-8">
                    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
