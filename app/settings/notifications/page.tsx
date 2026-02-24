'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell } from 'lucide-react';

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        email: {
            projectUpdates: true,
            mentions: true,
            weeklyReports: false,
        },
        push: {
            directMessages: true,
            taskAssignments: true,
            securityAlerts: true,
        }
    });

    const updatePreferences = (category: 'email' | 'push', key: string, value: boolean) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
    };

    return (
        <div className="max-w-7xl mx-auto md:mx-0">

            {/* 3-Col Layout */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Content: Toggles */}
                <div className="flex-1 min-w-0 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage all your notification preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Email Notifications */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-blue-900/30 mb-4">
                                <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </span>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Updates</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="project-updates" className="text-sm font-medium text-slate-700 dark:text-slate-200">Project Updates</Label>
                                        <p className="text-xs text-slate-500">Major changes and milestones</p>
                                    </div>
                                    <Switch
                                        id="project-updates"
                                        checked={preferences.email.projectUpdates}
                                        onCheckedChange={(c) => updatePreferences('email', 'projectUpdates', c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="team-mentions" className="text-sm font-medium text-slate-700 dark:text-slate-200">Team Mentions</Label>
                                        <p className="text-xs text-slate-500">When someone @mentions you</p>
                                    </div>
                                    <Switch
                                        id="team-mentions"
                                        checked={preferences.email.mentions}
                                        onCheckedChange={(c) => updatePreferences('email', 'mentions', c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="weekly-reports" className="text-sm font-medium text-slate-700 dark:text-slate-200">Weekly Reports</Label>
                                        <p className="text-xs text-slate-500">Summary of team activity</p>
                                    </div>
                                    <Switch
                                        id="weekly-reports"
                                        checked={preferences.email.weeklyReports}
                                        onCheckedChange={(c) => updatePreferences('email', 'weeklyReports', c)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Push Notifications */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-blue-900/30 mb-4">
                                <span className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                                    <Bell className="w-4 h-4" />
                                </span>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Push Notifications</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="dm" className="text-sm font-medium text-slate-700 dark:text-slate-200">Direct Messages</Label>
                                        <p className="text-xs text-slate-500">Messages from team members</p>
                                    </div>
                                    <Switch
                                        id="dm"
                                        checked={preferences.push.directMessages}
                                        onCheckedChange={(c) => updatePreferences('push', 'directMessages', c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="tasks" className="text-sm font-medium text-slate-700 dark:text-slate-200">Task Assignments</Label>
                                        <p className="text-xs text-slate-500">New tasks assigned to you</p>
                                    </div>
                                    <Switch
                                        id="tasks"
                                        checked={preferences.push.taskAssignments}
                                        onCheckedChange={(c) => updatePreferences('push', 'taskAssignments', c)}
                                    />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="security" className="text-sm font-medium text-slate-700 dark:text-slate-200">Security Alerts</Label>
                                        <p className="text-xs text-slate-500">Critical security events</p>
                                    </div>
                                    <Switch
                                        id="security"
                                        checked={preferences.push.securityAlerts}
                                        onCheckedChange={(c) => updatePreferences('push', 'securityAlerts', c)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Context Panel: Quick Filters */}
                <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                    <div className="sticky top-6 space-y-4">
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-[#0B1120]/60 p-6 border border-slate-200 dark:border-blue-900/30 rounded-2xl shadow-sm glass-obsidian">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Summary</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Channels</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">6/6</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-full rounded-full" />
                            </div>
                            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                                You are receiving all types of notifications. You might want to disable &quot;Weekly Reports&quot; to reduce inbox clutter.
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-blue-900/30 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-9 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-blue-900/50">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
                                    Pause all for 1 hour
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-9 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-blue-900/50">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
                                    Mute Team Mentions
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
