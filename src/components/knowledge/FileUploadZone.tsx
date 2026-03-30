"use client";

import React, { useState, useCallback } from "react";
<<<<<<< Updated upstream
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
=======
import { UploadCloud, FileText, X, CheckCircle2, Loader2, Database, Cog } from "lucide-react";
>>>>>>> Stashed changes
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { rag } from "@/lib/sdk/modules/rag";


export interface FileUploadZoneProps {
<<<<<<< Updated upstream
    tenantId: string;
    authToken: string;
    onUploadComplete?: (documentId: string, filename: string) => void;
}

type UploadStatus = 'uploading' | 'completed' | 'error';
type QueueItem = { file: File; progress: number; status: UploadStatus; error?: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777';
=======
    onUpload?: (files: File[], category?: string) => void;
}

const REGULATORY_TAGS = [
    { id: 'pbi', label: '[PBI] Peraturan BI', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    { id: 'pojk', label: '[POJK] Peraturan OJK', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { id: 'katalog', label: '[Katalog] Harga Daerah', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    { id: 'laporan', label: '[Laporan] Data Mentah', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
];

export function FileUploadZone({ onUpload }: FileUploadZoneProps) {
    const [uploadQueue, setUploadQueue] = useState<{ file: File; progress: number; status: 'uploading' | 'completed' | 'error' }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('laporan');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // 1. Initial State
        const newFiles = acceptedFiles.map(file => ({
            file,
            progress: 0,
            status: 'uploading' as const
        }));
>>>>>>> Stashed changes

async function uploadFileViaPresign(
    file: File,
    tenantId: string,
    authToken: string,
    onProgress: (p: number) => void
): Promise<{ documentId: string }> {
    // Step 1: Get presigned URL from backend
    const presignRes = await fetch(
        `${API_BASE} /api/v1 / documents / presign ? filename = ${encodeURIComponent(file.name)} `,
        {
            headers: {
                Authorization: `Bearer ${authToken} `,
                'X-Tenant-ID': tenantId,
            },
        }
    );
    if (!presignRes.ok) throw new Error('Failed to get presigned URL');
    const { presigned_url, object_key } = await presignRes.json();

<<<<<<< Updated upstream
    onProgress(20); // Presign done

    // Step 2: PUT file directly to S3/MinIO (no server RAM usage)
    const uploadRes = await fetch(presigned_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
    });
    if (!uploadRes.ok) throw new Error('S3 upload failed');

    onProgress(85); // Upload done

    // Step 3: Confirm to backend → triggers Asynq vectorization worker
    const confirmRes = await fetch(`${API_BASE} /api/v1 / documents / confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken} `,
            'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ title: file.name, object_key }),
    });
    if (!confirmRes.ok) throw new Error('Failed to confirm upload');
    const { document_id } = await confirmRes.json();

    onProgress(100);
    return { documentId: document_id };
}

export function FileUploadZone({ tenantId, authToken, onUploadComplete }: FileUploadZoneProps) {
    const [uploadQueue, setUploadQueue] = useState<QueueItem[]>([]);

    const updateItem = (file: File, patch: Partial<QueueItem>) => {
        setUploadQueue(prev => prev.map(q => q.file === file ? { ...q, ...patch } : q));
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newItems: QueueItem[] = acceptedFiles.map(file => ({ file, progress: 0, status: 'uploading' }));
        setUploadQueue(prev => [...prev, ...newItems]);

        for (const item of newItems) {
            try {
                const { documentId } = await uploadFileViaPresign(
                    item.file,
                    tenantId,
                    authToken,
                    (p) => updateItem(item.file, { progress: p }),
                );
                updateItem(item.file, { progress: 100, status: 'completed' });
                onUploadComplete?.(documentId, item.file.name);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Upload failed';
                updateItem(item.file, { status: 'error', error: message });
            }
        }
    }, [tenantId, authToken, onUploadComplete]);
=======
        // 2. Process each file
        for (const item of newFiles) {
            try {
                // Step A: Upload and get Document ID (HTTP 202)
                const res = await rag.uploadDocument(item.file, selectedCategory, "tenant-1");
                if (!res.success || !res.documentId) throw new Error("Upload refused");

                const docId = res.documentId;
                const startTime = Date.now();

                // Step B: Poll until COMPLETED or FAILED
                const pollInterval = setInterval(async () => {
                    const elapsed = Date.now() - startTime;
                    const pollRes = await rag.pollDocumentStatus(docId, elapsed);

                    setUploadQueue(prev => prev.map(q => {
                        if (q.file === item.file) {
                            // Map backend status to UI status
                            let uiStatus = q.status;
                            if (pollRes.status === 'COMPLETED') uiStatus = 'completed';
                            else if (pollRes.status === 'FAILED') uiStatus = 'error';

                            return { ...q, progress: pollRes.progress, status: uiStatus, backendState: pollRes.status };
                        }
                        return q;
                    }));

                    if (pollRes.status === 'COMPLETED') {
                        clearInterval(pollInterval);
                        if (onUpload) onUpload([item.file], selectedCategory);
                    } else if (pollRes.status === 'FAILED') {
                        clearInterval(pollInterval);
                    }
                }, 1500); // Poll every 1.5s
            } catch (err) {
                setUploadQueue(prev => prev.map(q => q.file === item.file ? { ...q, status: 'error' } : q));
            }
        }
    }, [onUpload, selectedCategory]);
>>>>>>> Stashed changes

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt', '.md'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (fileToRemove: File) => {
        setUploadQueue(prev => prev.filter(item => item.file !== fileToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Context/Category Selector */}
            <div className="space-y-2 mb-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Document Category / Context
                </label>
                <div className="flex flex-wrap gap-2">
                    {REGULATORY_TAGS.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => setSelectedCategory(tag.id)}
                            className={cn(
                                "text-xs px-3 py-1.5 rounded-full font-medium transition-all shadow-sm",
                                selectedCategory === tag.id 
                                    ? `ring-2 ring-offset-1 ring-blue-500/50 ${tag.color}` 
                                    : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                            )}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Drop Zone Area */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 cursor-pointer text-center overflow-hidden group",
                    "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
                    isDragActive
                        ? "border-blue-500 bg-blue-50/80 scale-[1.01] shadow-xl"
                        : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                )}
            >
                <input {...getInputProps()} />

                {/* Glow Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex flex-col items-center gap-4 z-10">
                    <div className={cn(
                        "p-4 rounded-full transition-all duration-300 shadow-sm",
                        isDragActive ? "bg-blue-100 text-blue-600" : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    )}>
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                            {isDragActive ? "Drop files here!" : "Click or drag files to upload"}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Supports PDF, DOCX, TXT, and MD (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* File Queue */}
            {uploadQueue.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                    {uploadQueue.map((item, idx) => (
                        <div key={idx} className="relative flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in slide-in-from-top-2 overflow-hidden">

                            {/* Progress bar */}
                            <div
                                className={cn(
                                    "absolute bottom-0 left-0 h-1 transition-all duration-300",
                                    item.status === 'error' ? 'bg-red-500' : 'bg-blue-500',
                                )}
                                style={{ width: `${item.progress}%`, opacity: item.status === 'completed' ? 0 : 1 }}
                            />

                            <div className="flex items-center gap-4 z-10">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    item.status === 'completed' ? "bg-green-100 text-green-600" :
                                        item.status === 'error' ? "bg-red-100 text-red-500" :
                                            "bg-blue-50 text-blue-500"
                                )}>
                                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                        item.status === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                            <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{(item.file.size / 1024).toFixed(0)} KB</span>
                                        {item.status === 'uploading' && (
<<<<<<< Updated upstream
                                            <><span>•</span><span className="text-blue-500 font-medium">Uploading {item.progress}%</span></>
=======
                                            <>
                                                <span>•</span>
                                                <span className="text-blue-500 font-medium flex items-center gap-1">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    {/* @ts-ignore - dynamic property from state injection */}
                                                    {item.backendState === 'PARSING' ? 'Extracting Text...' 
                                                        // @ts-ignore
                                                        : item.backendState === 'VECTORIZING' ? 'Embedding AI...' 
                                                        : 'Uploading...'} {item.progress}%
                                                </span>
                                            </>
>>>>>>> Stashed changes
                                        )}
                                        {item.status === 'completed' && (
                                            <><span>•</span><span className="text-green-500 font-medium">Queued for indexing</span></>
                                        )}
                                        {item.status === 'error' && (
                                            <><span>•</span><span className="text-red-500 font-medium">{item.error}</span></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(item.file); }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
