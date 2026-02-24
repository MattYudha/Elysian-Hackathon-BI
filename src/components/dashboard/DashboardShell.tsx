// Enterprise Dashboard Shell
// Implements strict 12-column grid architecture as requested by Technical Advisor

'use client';

import { Suspense, useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';

// Queries
import { useDashboardStats, useChartData, useActivityFeed } from '@/queries/dashboard.queries';
import { useWorkflows, useCreateWorkflow } from '@/queries/workflow.queries';

// Enterprise Components
import { PrimaryKpiCard } from './enterprise/PrimaryKpiCard';
import { TokenUsageChartCard, ChartDataPoint } from './enterprise/TokenUsageChartCard';
import { SystemHealthCard } from './enterprise/SystemHealthCard';
import { ActivePipelinesList } from './ActivePipelinesList';
import { PipelineDetailDrawer } from './PipelineDetailDrawer';
import { QuickCreateModalLayout } from '@/components/ui/QuickCreateModalLayout';
import { AiCopilotWidget } from './enterprise/AiCopilotWidget';
import { PriorityActionQueue, ActionItem } from './enterprise/PriorityActionQueue';
import { TenantAvatarGroup, type TenantMember } from './TenantAvatarGroup';

// New "Expansion" Components
import { CostForecaster } from './enterprise/CostForecaster';
import { LatencyMonitor } from './enterprise/LatencyMonitor';
import { AuditLogWidget } from './enterprise/AuditLogWidget';
import type { CostMetric, LatencyMetric, AuditLog } from '@/types/api-responses';

interface DashboardShellProps {
    initialStatusFilter?: string;
}

export function DashboardShell({ }: DashboardShellProps) {
    const { t } = useTranslation();
    const user = useAuthStore(state => state.user);

    // Data Hooks
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: chartData, isLoading: chartLoading } = useChartData();
    const { data: activities, isLoading: activitiesLoading } = useActivityFeed();
    const { data: pipelines, isLoading: pipelinesLoading } = useWorkflows();
    const createPipelineMutation = useCreateWorkflow();

    // UI States
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [pipelineName, setPipelineName] = useState('');

    // Drawer States
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCreatePipeline = () => {
        if (!pipelineName.trim()) return;
        createPipelineMutation.mutate(
            { name: pipelineName, status: 'draft' },
            {
                onSuccess: () => {
                    setIsQuickCreateOpen(false);
                    setPipelineName('');
                }
            }
        );
    };

    // Transform Data
    const chartPoints: ChartDataPoint[] = (chartData ?? []).map(d => ({
        day: d.day,
        tokens: d.tokens,
        projected: d.projected,
    }));

    const activityItems: ActionItem[] = (activities ?? []).map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        timestamp: a.timestamp,
        type: 'system', // Mock type mapping
        priority: 'medium', // Mock priority
    }));

    // Mock Enterprise Data (In real app, fetch via React Query)
    const costData: CostMetric[] = Array.from({ length: 14 }, (_, i) => ({
        date: `Oct ${i + 1}`,
        amount: Math.floor(Math.random() * 500) + 100,
        currency: 'USD',
        budget: 5000,
        projected: 3500 + (i * 150)
    }));

    const latencyData: LatencyMetric[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: `${i}:00`,
        p95: 150 + Math.random() * 50,
        p99: 300 + Math.random() * 200,
        errors: 0
    }));

    const auditLogs: AuditLog[] = [
        { id: '1', user: { name: 'Alice Admin', email: 'alice@elysian.com' }, action: 'Updated API Key', target: 'Prod-Key-01', timestamp: new Date().toISOString(), status: 'success' },
        { id: '2', user: { name: 'Bob DevOps', email: 'bob@elysian.com' }, action: 'Rollback Pipeline', target: 'RAG-Flow-v2', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'success' },
        { id: '3', user: { name: 'Charlie Sec', email: 'charlie@elysian.com' }, action: 'Force Rotate', target: 'Db-Creds', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'failure' },
    ];

    const mockTenantMembers: TenantMember[] = [
        { id: 'u1', name: 'Matt Yudha', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 'u2', name: 'Alice Smith', role: 'member', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 'u3', name: 'Bob Jenkins', role: 'member' },
        { id: 'u4', name: 'Charlie Dev', role: 'viewer', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
        { id: 'u5', name: 'Eve Ops', role: 'viewer' },
    ];

    return (
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Admin'}. Here is your platform status.</p>
                </div>

                {/* Header Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <div className="flex items-center gap-4 pr-3 border-r border-slate-200/60 mr-1 hidden md:flex">
                        <span className="text-xs font-medium text-slate-500 mr-2">Tenant Access</span>
                        <TenantAvatarGroup members={mockTenantMembers} max={3} size="default" />
                    </div>

                    <button
                        onClick={() => setIsQuickCreateOpen(true)}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <span>+ Quick Create</span>
                    </button>
                    <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-blue-900/30 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>Last 30 Days</span>
                    </button>
                    <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                        <Download className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Main Enterprise 12-Column Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">

                {/* ========================================== */}
                {/* LEFT COLUMN: MAIN ANALYTICS (Span 8 cols)  */}
                {/* ========================================== */}
                <div className="flex min-w-0 flex-col space-y-4 sm:space-y-6 lg:col-span-7 xl:col-span-8">

                    {/* 1. Primary KPIs (Row of 3 or 4 small cards) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <PrimaryKpiCard
                            label="Total Documents"
                            value={(stats?.docs ?? 0).toLocaleString()}
                            delta={12}
                            isLoading={statsLoading}
                        />
                        <PrimaryKpiCard
                            label="API Calls"
                            value={(stats?.apiCalls ?? 0).toLocaleString()}
                            delta={-2.4}
                            isLoading={statsLoading}
                        />
                        <PrimaryKpiCard
                            label="Active Pipelines"
                            value={stats?.activePipelines ?? 0}
                            delta={5}
                            isLoading={statsLoading}
                        />
                    </div>

                    {/* 2. Secondary Analytics (Two charts side-by-side) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Token Usage Area Chart */}
                        <div className="w-full min-w-0">
                            <TokenUsageChartCard data={chartPoints} isLoading={chartLoading} />
                        </div>

                        {/* System Health Radial */}
                        <div className="w-full min-w-0">
                            <SystemHealthCard isLoading={statsLoading} />
                        </div>
                    </div>

                    {/* 3. Cost Forecaster (Full Width) */}
                    <div className="w-full min-w-0">
                        <CostForecaster data={costData} isLoading={statsLoading} />
                    </div>

                    {/* 4. Latency Monitor (Full Width) */}
                    <div className="w-full min-w-0">
                        <LatencyMonitor data={latencyData} isLoading={statsLoading} />
                    </div>

                    {/* 5. Active Pipelines Timeline (Full width) */}
                    <div className="w-full min-w-0">
                        <ActivePipelinesList
                            onPipelineClick={(id) => {
                                setSelectedPipelineId(id);
                                setIsDrawerOpen(true);
                            }}
                        />
                    </div>

                    {/* 6. Audit Logs (Full Width) */}
                    <div className="w-full min-w-0">
                        <AuditLogWidget logs={auditLogs} isLoading={statsLoading} />
                    </div>

                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: ASSISTANT & TASKS (Span 4 cols) */}
                {/* ========================================== */}
                <div className="flex w-full flex-col space-y-4 sm:space-y-6 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:no-scrollbar pb-6">

                    {/* 1. AI Assistant Widget (Persistent, highly prominent) */}
                    <div className="shrink-0">
                        <AiCopilotWidget />
                    </div>

                    {/* 2. Activity / Priority Queue */}
                    <div className="shrink-0">
                        <PriorityActionQueue actions={activityItems} isLoading={activitiesLoading} />
                    </div>

                </div>
            </div>

            {/* Pipeline Detail Drawer */}
            <PipelineDetailDrawer
                pipelineId={selectedPipelineId}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    // intentionally not clearing ID immediately to allow exit animation to use data
                    setTimeout(() => setSelectedPipelineId(null), 300);
                }}
            />

            {/* Quick Create Modal - Functional Implementation */}
            <QuickCreateModalLayout
                open={isQuickCreateOpen}
                onClose={() => {
                    setIsQuickCreateOpen(false);
                    setPipelineName('');
                }}
                onSubmitShortcut={() => handleCreatePipeline()}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-50 tracking-tight">Quick Create Pipeline</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-300 border border-slate-200 shadow-sm">Cmd</kbd> + <kbd className="font-mono bg-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-300 border border-slate-200 shadow-sm">Enter</kbd> to submit instantly.</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pipeline Name</label>
                            <input
                                type="text"
                                value={pipelineName}
                                onChange={(e) => setPipelineName(e.target.value)}
                                className="w-full rounded-lg border border-blue-100/50 dark:border-blue-900/30 bg-white/60 dark:bg-[#0B1120]/60 px-3 py-2 text-sm outline-none focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-200"
                                placeholder="e.g. Data Ingestion RAG"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Template</label>
                            <select className="w-full rounded-lg border border-blue-100/50 dark:border-blue-900/30 bg-white/60 dark:bg-[#0B1120]/60 px-3 py-2 text-sm outline-none focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-200">
                                <option>Blank Pipeline</option>
                                <option>Document Q&A RAG</option>
                                <option>Customer Support Agent</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-blue-100/30 dark:border-blue-900/30">
                        <button
                            onClick={() => {
                                setIsQuickCreateOpen(false);
                                setPipelineName('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreatePipeline}
                            disabled={createPipelineMutation.isPending || !pipelineName.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createPipelineMutation.isPending ? 'Creating...' : 'Create Pipeline'}
                        </button>
                    </div>
                </div>
            </QuickCreateModalLayout>
        </div>
    );
}

// Re-export as a Server Component compatible export 
// (though it's 'use client', it's safe to be rendered by Page)
