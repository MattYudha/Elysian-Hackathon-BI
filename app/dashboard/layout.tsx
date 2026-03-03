import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';
import { StoreInitializer } from '@/components/providers/StoreInitializer';
import { config } from '@/lib/config';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    // In Edge middleware, we rely on standard next/server. Here we use next/headers
    const authCookie = cookieStore.get('auth_token')?.value || cookieStore.get('session')?.value;

    if (!authCookie) {
        redirect('/login');
    }

    // Heavy Lifter: Server-to-Server Session Validation
    // This executes securely in the Node environment before the React UI tree ever mounts.
    try {
        const response = await fetch(`${config.api.baseURL}/api/v1/auth/me`, {
            headers: {
                Cookie: `auth_token=${authCookie}`,
            },
            cache: 'no-store', // Crucial: Never cache raw authentication state
        });

        if (!response.ok) {
            // The cookie exists but the Backend rejected it (e.g. revoked or expired in DB).
            throw new Error('Server rejected the session cookie.');
        }

        const responseData = await response.json();
        // Fallback user object structure assuming typical data wrappers.
        const user = responseData.data?.user || responseData.data || { name: 'Elysian User', email: 'user@elysian.com' };

        return (
            <div className="flex h-[100dvh] w-full overflow-hidden relative z-0 bg-slate-50/50 dark:bg-[#060D18]">
                {/* 
                    Synchronous Client Memory Hydration: 
                    Obliterates the client waterfall by passing the validated SSR user directly into Zustand.
                */}
                <StoreInitializer user={user} />

                <ElysianGrid />

                <Sidebar />

                <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
                    <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <DashboardNavbar staticMode={true} />
                    </div>

                    <div id="main-scroll-container" className="flex-1 overflow-y-auto relative">
                        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        );

    } catch (error) {
        // Absolute fallback route defense
        console.error("SSR Hydration Defense Triggered:", error);
        redirect('/login?session_expired=true');
    }
}
