'use client';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden relative z-0">
            <ElysianGrid />
            {/* Legacy Sidebar Fixed */}
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Floating Navbar */}
                <DashboardNavbar />

                <div id="main-scroll-container" className="flex-1 overflow-y-auto pt-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
