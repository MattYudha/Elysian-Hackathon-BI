'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sparkles, ShieldCheck, FileEdit, Star, Users, SlidersHorizontal, Plus, DownloadCloud } from 'lucide-react';

export default function SkillsPage() {
    const installedSkills = [
        {
            id: "figma",
            name: "Figma to code",
            description: "Translate design frames into UI-ready components.",
            category: "Design",
            lastUsed: "2 days ago",
            enabled: true,
            icon: Sparkles,
        },
        {
            id: "ci",
            name: "CI failure triage",
            description: "Summarize failed checks and propose next fixes.",
            category: "DevOps",
            lastUsed: "Yesterday",
            enabled: true,
            icon: ShieldCheck,
        },
        {
            id: "meeting",
            name: "Meeting to action items",
            description: "Extract decisions and next steps from transcripts.",
            category: "Docs",
            lastUsed: "4 days ago",
            enabled: false,
            icon: FileEdit,
        },
    ];

    const skillLibrary = [
        {
            id: "release-notes",
            title: "Release notes generator",
            description: "Turns merged work into polished release notes.",
            icon: Star,
        },
        {
            id: "support",
            title: "Support reply drafts",
            description: "Creates empathetic responses with product context.",
            icon: Users,
        },
        {
            id: "research",
            title: "User research summaries",
            description: "Condenses interviews into insights and themes.",
            icon: Sparkles,
        },
        {
            id: "roadmap",
            title: "Roadmap planner",
            description: "Builds milestones and timelines from strategy notes.",
            icon: SlidersHorizontal,
        },
    ];

    const insights = [
        { id: "top-skill", label: "Top skill", value: "Figma to code" },
        { id: "weekly-runs", label: "Runs this week", value: "28" },
        { id: "time-saved", label: "Estimated time saved", value: "6.4 hrs" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Skills</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Skills are reusable workflows. Add them to agents or use them directly to speed up repeat tasks.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Installed Skills */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Installed skills</h4>
                    <Button variant="outline" size="sm" className="hidden sm:flex">Manage library</Button>
                </div>

                <div className="space-y-3">
                    {installedSkills.map((skill) => {
                        const Icon = skill.icon;
                        return (
                            <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-5 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{skill.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{skill.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 bg-slate-50/50 dark:bg-slate-800/30">
                                            {skill.category}
                                        </span>
                                        <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 bg-slate-50/50 dark:bg-slate-800/30">
                                            Last used {skill.lastUsed}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${skill.enabled ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {skill.enabled ? 'Active' : 'Paused'}
                                    </span>
                                    <Switch defaultChecked={skill.enabled} className="data-[state=checked]:bg-emerald-500" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Skill Library */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Skill library</h4>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">Browse all</Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {skillLibrary.map((skill) => {
                        const LibIcon = skill.icon;
                        return (
                            <button
                                key={skill.id}
                                type="button"
                                className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B1120] px-5 py-5 text-left transition-all hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-sm"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-sm">
                                    <LibIcon className="h-5 w-5" />
                                </span>
                                <div className="space-y-1.5 mt-1">
                                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{skill.title}</h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {skill.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Usage Insights */}
            <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Usage insights</h4>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                    {insights.map((insight) => (
                        <div key={insight.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-4 shadow-sm">
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{insight.label}</div>
                            <div className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">{insight.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4 text-blue-500" /> Install from library
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <DownloadCloud className="h-4 w-4" /> Import from repo
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                        <Sparkles className="h-4 w-4" /> Create new skill
                    </Button>
                </div>
            </div>

        </div>
    );
}
