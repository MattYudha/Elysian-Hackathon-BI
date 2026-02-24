'use client';

import { Button } from '@/components/ui/button';
import { UploadCloud, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function ImportPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Import Data</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Bring your projects, tasks, and teammates from other tools into Elysian.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Stepper Logic (Static for now) */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 relative">
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
                {['Upload', 'Map Columns', 'Import'].map((step, idx) => (
                    <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${idx === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-[#0B1120] border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                            {idx + 1}
                        </div>
                        <span className={`text-xs font-medium text-center max-w-[80px] sm:max-w-none ${idx === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step}</span>
                    </div>
                ))}
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group">
                <div className="h-16 w-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Click to upload or drag and drop</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                    Supports CSV, XLS, XLSX formats up to 50MB. Make sure your data includes header rows.
                </p>
                <Button variant="outline" className="gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <FileSpreadsheet className="h-4 w-4" />
                    Browse Files
                </Button>
            </div>

            <div className="flex justify-end pt-4">
                <Button disabled className="gap-2 w-full sm:w-auto">
                    Next Step <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
