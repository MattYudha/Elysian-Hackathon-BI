'use client';

import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/contexts/SidebarContext';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/config/nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// Icon mapping from string names to Lucide components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    Home: LucideIcons.LayoutDashboard,
    dashboard: LucideIcons.LayoutDashboard, // Fix for nav.ts key
    chat: LucideIcons.Bot, // Fix for nav.ts key
    Message: LucideIcons.Bot,
    Book: LucideIcons.Book,
    Settings: LucideIcons.Settings,
    Workflow: LucideIcons.Workflow,
    FileText: LucideIcons.FileText,
    Briefcase: LucideIcons.Briefcase,
    Activity: LucideIcons.Activity,
    Users: LucideIcons.Users,
    Database: LucideIcons.Database,

};

export function NavigationMenu() {
    const { user } = useAuthStore();
    const { isOpen } = useSidebar();
    const pathname = usePathname();

    const hasAnyRole = (allowedRoles: string[]) => {
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
    };

    const filteredNav = mainNav.filter((item) => {
        // Check role requirement
        if (item.roles && !hasAnyRole(item.roles)) {
            return false;
        }

        // Check feature flag (if library supports it)
        // if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
        //   return false;
        // }

        return true;
    });

    // Group by section
    const groupedNav: Record<string, typeof filteredNav> = {
        'Main': [],
        'System': []
    };

    filteredNav.forEach(item => {
        const section = item.section || 'Main';
        if (!groupedNav[section]) groupedNav[section] = [];
        groupedNav[section].push(item);
    });

    return (
        <nav className="space-y-6">
            {Object.entries(groupedNav).map(([section, items]) => {
                if (items.length === 0) return null;

                return (
                    <div key={section} className="space-y-1">
                        {isOpen && (
                            <h4 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                {section}
                            </h4>
                        )}
                        {!isOpen && (
                            <div className="h-px w-6 mx-auto bg-slate-200 dark:bg-slate-700/50 my-2" />
                        )}

                        {items.map((item) => {
                            const Icon = getIcon(item.icon);
                            const isActive = pathname === item.href;

                            // Map hrefs to onboarding IDs
                            const getOnboardingId = (href: string) => {
                                const idMap: Record<string, string> = {
                                    '/chat': 'ai-assistant-trigger',
                                    '/knowledge': 'knowledge-base-trigger',
                                    '/editor': 'editor-trigger',
                                    '/workflow': 'workflow-trigger',
                                    '/settings': 'settings-trigger',
                                };
                                return idMap[href];
                            };

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    id={getOnboardingId(item.href)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden',
                                        !isOpen && 'justify-center px-2',
                                        isActive
                                            ? 'text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/40 dark:to-transparent shadow-sm shadow-blue-100/50 dark:shadow-none'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-300'
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                                    )}
                                    <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400")} />
                                    {isOpen && <span className="animate-in fade-in duration-200">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                );
            })}
        </nav>
    );
}

function getIcon(iconName: string) {
    return iconMap[iconName] || LucideIcons.Home;
}
