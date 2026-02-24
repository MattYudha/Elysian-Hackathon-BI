import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

export default function ChatLayout({
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
                {/* Navbar is strictly static here to push content down */}
                <div className="flex-none">
                    <DashboardNavbar staticMode />
                </div>

                <div className="flex-1 overflow-hidden flex flex-col pb-16 md:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
