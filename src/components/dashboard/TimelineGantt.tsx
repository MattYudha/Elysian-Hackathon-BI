"use client";

import { useState } from "react"
import { addDays, differenceInDays, format, isWithinInterval, startOfWeek } from "date-fns"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Search } from "lucide-react"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface TimelineTask {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

type TimelineGanttProps = {
    tasks: TimelineTask[];
    onTaskClick?: (taskId: string) => void;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

export function TimelineGantt({ tasks, onTaskClick }: TimelineGanttProps) {
    const [rangeStart, setRangeStart] = useState<Date | null>(null)
    const [viewMode, setViewMode] = useState<"week" | "month">("week")

    const minDate = tasks.length > 0 ? tasks.reduce((acc, t) => (t.startDate < acc ? t.startDate : acc), tasks[0].startDate) : new Date()
    const maxDate = tasks.length > 0 ? tasks.reduce((acc, t) => (t.endDate > acc ? t.endDate : acc), tasks[0].endDate) : new Date()
    const minWeekStart = startOfWeek(minDate, { weekStartsOn: 1 })
    const maxWeekStart = startOfWeek(maxDate, { weekStartsOn: 1 })

    const effectiveRangeStart = rangeStart ?? minWeekStart
    const currentWeekStart = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })

    const clampToRange = (date: Date) => {
        if (date.getTime() < minWeekStart.getTime()) return minWeekStart
        if (date.getTime() > maxWeekStart.getTime()) return maxWeekStart
        return date
    }

    const daysLength = viewMode === "week" ? 7 : 30;
    const days = (() => {
        const start = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })
        return Array.from({ length: daysLength }).map((_, i) => addDays(start, i))
    })()

    const monthLabel = format(days[0], "MMMM yyyy")

    const today = new Date()
    const todayInRange = isWithinInterval(today, { start: days[0], end: addDays(days[days.length - 1], 1) })
    const todayIndex = todayInRange
        ? clamp(differenceInDays(today, days[0]), 0, days.length - 1)
        : Math.floor(days.length / 2)

    const handlePrevious = () => {
        setRangeStart((prev) => {
            const base = prev ?? minWeekStart
            const nextWeek = addDays(base, -daysLength)
            return clampToRange(nextWeek)
        })
    }

    const handleNext = () => {
        setRangeStart((prev) => {
            const base = prev ?? minWeekStart
            const nextWeek = addDays(base, daysLength)
            return clampToRange(nextWeek)
        })
    }

    const handleToday = () => {
        const base = startOfWeek(today, { weekStartsOn: 1 })
        setRangeStart(base)
    }

    const rangeStartDate = days[0]
    const rangeEndDate = addDays(days[days.length - 1], 1)

    const hasTasksInRange = tasks.some((t) => t.startDate < rangeEndDate && t.endDate >= rangeStartDate)

    const canGoPrevious = currentWeekStart.getTime() > minWeekStart.getTime()
    const canGoNext = currentWeekStart.getTime() < maxWeekStart.getTime()

    return (
        <section>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-50">Pipeline Timeline</h2>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl shadow-sm glass-obsidian">
                <div className="w-full min-w-[760px]">
                    <div className="grid grid-cols-[240px_1fr]">
                        <div className="px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 border-r border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40">
                            Pipeline Name
                        </div>
                        <div className="px-4 py-2 border-b border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{monthLabel}</div>
                                <div className="flex items-center gap-1 sm:gap-2">

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 sm:h-9 sm:w-9 rounded-full text-slate-600 dark:text-slate-300"
                                        aria-label="Previous"
                                        onClick={handlePrevious}
                                        disabled={!canGoPrevious}
                                    >
                                        <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-12 sm:h-9 rounded-lg px-4 sm:px-3 text-sm sm:text-xs bg-transparent text-slate-600 dark:text-slate-300"
                                        onClick={handleToday}
                                    >
                                        Today
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 sm:h-9 sm:w-9 rounded-full text-slate-600 dark:text-slate-300"
                                        aria-label="Next"
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                    >
                                        <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
                                    </Button>

                                    <div className="w-px h-8 sm:h-6 bg-blue-100/50 dark:bg-blue-900/50 mx-1" />

                                    <Select value={viewMode} onValueChange={(v: "week" | "month") => setViewMode(v)}>
                                        <SelectTrigger className="h-12 sm:h-9 text-sm sm:text-xs border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-slate-800 w-[110px] sm:w-[95px] text-slate-700 dark:text-slate-200">
                                            <SelectValue placeholder="View" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="week">1 Week</SelectItem>
                                            <SelectItem value="month">1 Month</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 sm:h-9 sm:w-9 rounded-full text-slate-600 dark:text-slate-300" aria-label="Date range">
                                                <Calendar className="h-5 w-5 sm:h-4 sm:w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <CalendarUI
                                                mode="single"
                                                selected={effectiveRangeStart}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setRangeStart(startOfWeek(date, { weekStartsOn: 1 }))
                                                    }
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[240px_1fr]">
                        <div className="border-r border-blue-100/50 dark:border-blue-900/30 bg-white/20 dark:bg-slate-900/20" />
                        <div
                            className={`grid px-4 py-2 bg-white/20 dark:bg-slate-900/20 gap-1`}
                            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(3rem, 1fr))` }}
                        >
                            {days.map((d) => (
                                <div key={d.toISOString()} className="flex flex-col text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                                    <span className="font-medium">{format(d, "EEE")}</span>
                                    <span className="text-xs text-slate-800 dark:text-slate-300">{format(d, "d")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full bg-blue-100/50 dark:bg-blue-900/30" />

                    <div className="relative">
                        <div
                            className="absolute top-0 bottom-0 w-px bg-cyan-400 dark:bg-cyan-600 z-10 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                            style={{ left: `calc(240px + 16px + ${(todayIndex / days.length) * 100}%)` }}
                            aria-hidden="true"
                        />

                        {!hasTasksInRange && (
                            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-[#0B1120]/60 backdrop-blur-sm">
                                <div className="rounded-md border border-dashed border-blue-200/50 dark:border-blue-900/50 bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 shadow-sm">
                                    No pipelines found in this view
                                </div>
                            </div>
                        )}

                        {tasks.map((t, rowIdx) => {
                            const startOffset = differenceInDays(t.startDate, days[0])
                            const endOffset = differenceInDays(t.endDate, days[0])

                            const totalDays = days.length
                            const leftPct = clamp((startOffset / totalDays) * 100, 0, 100)
                            const rightPct = clamp((endOffset / totalDays) * 100, 0, 100)
                            const minWidthPct = (1 / totalDays) * 100
                            const widthPct = clamp(rightPct - leftPct + minWidthPct, minWidthPct, 100)

                            return (
                                <div key={t.id} className="grid grid-cols-[240px_1fr] relative content-center group cursor-pointer" onClick={() => onTaskClick?.(t.id)}>
                                    <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium border-r border-blue-100/50 dark:border-blue-900/30 truncate flex items-center justify-start h-12 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 transition-colors">
                                        {t.name}
                                    </div>
                                    <div className="relative px-4 py-0 h-12 flex items-center group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 transition-colors">
                                        <div className="absolute inset-0 grid gap-0 px-4" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(3rem, 1fr))` }}>
                                            {Array.from({ length: days.length }).map((_, i) => (
                                                <div key={i} className="h-full border-l border-blue-50/50 dark:border-blue-900/20 first:border-l-0" />
                                            ))}
                                        </div>
                                        <div
                                            className="absolute h-7 rounded-md bg-gradient-to-r from-blue-500/80 to-cyan-400/80 border border-blue-100/50 dark:border-blue-700/50 px-2 flex items-center shadow-sm z-10 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                                            style={{ left: `calc(${leftPct}% + 16px)`, width: `max(calc(${widthPct}% - 32px), 48px)` }}
                                            title={t.name}
                                        >
                                            <span className="text-xs text-white font-medium truncate drop-shadow-sm pointer-events-none">{t.name}</span>
                                        </div>
                                    </div>
                                    {rowIdx < tasks.length - 1 ? <div className="absolute bottom-0 w-full h-px bg-blue-100/50 dark:bg-blue-900/30" /> : null}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
