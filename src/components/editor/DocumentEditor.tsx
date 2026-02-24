'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorDocument } from '@/lib/sdk/schemas';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { rag } from '@/lib/sdk/modules/rag';
import { extractPlainText } from '@/lib/editor/aiContext';
import { useEditorStore } from '@/store/editorStore';
import { useCrashRecovery } from '@/hooks/use-crash-recovery';
import { SlashCommand, getSuggestionItems, renderItems } from './extensions/slash-command';
import { VersionHistory } from './VersionHistory';
import { useGhostwriter } from '@/hooks/use-ghostwriter';
import { GhostwriterWidget } from './GhostwriterWidget';

interface DocumentEditorProps {
    document: EditorDocument;
    initialContent: JSONContent | null;
    onChange: (content: JSONContent) => void;
    onSave: () => void;
    pdfUrl?: string;
    isMobile?: boolean;
}

export function DocumentEditor({
    document,
    initialContent,
    onChange,
    onSave,
    pdfUrl,
    isMobile = false
}: DocumentEditorProps) {
    // Enterprise Store & Persistence
    const { setDocument, updateContent, currentDocument, isDirty, createSnapshot } = useEditorStore();
    useCrashRecovery();

    // Initialize store on mount (with Draft Protection)
    useEffect(() => {
        // If we are opening a different document, load it.
        if (currentDocument?.id !== document.id) {
            setDocument(document);
        } else {
            // Same document ID. 
            // Only overwrite if we DON'T have a dirty draft.
            // If isDirty is true, we keep the local version (Persistence).
            if (!isDirty) {
                setDocument(document);
            }
        }
    }, [document.id, document, currentDocument?.id, isDirty, setDocument]);

    // Sync Editor with Store (Handling Restore)


    // Default schema to prevent crashes
    const defaultContent: JSONContent = {
        type: 'doc',
        content: [{ type: 'paragraph' }]
    };

    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
        }),
        Placeholder.configure({
            placeholder: 'Type "/" for commands...',
            emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0',
        }),
        CharacterCount,
        SlashCommand.configure({
            suggestion: {
                items: getSuggestionItems,
                render: renderItems,
            },
        }),
    ], []);

    const editor = useEditor({
        extensions,
        // PRIORITY: Use rehydrated draft if available, else initial content
        content: currentDocument?.content || initialContent || defaultContent,
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-base w-full p-10 focus:outline-none min-h-[800px] dark:prose-invert max-w-none bg-white dark:bg-[#0B1120] shadow-sm mx-auto my-4 border border-slate-200 dark:border-blue-900/30',
            },
            handleKeyDown: (_view, _event) => {
                // This handleKeyDown is intentionally left empty or for specific key events.
                // The onUpdate callback below handles content changes for persistence.
                // If specific key events need to trigger content updates, they should be added here.
            },
        },
        onUpdate: ({ editor }) => {
            // Prevent ghost updates on mount/hydration
            if (!editor.isFocused) return;

            updateContent(editor.getJSON());
            onChange(editor.getJSON());
        },
        immediatelyRender: false,
    });

    // Enterprise: AI Ghostwriter (Initialized AFTER editor)
    const { suggestion, isLoading: isGhostwriterLoading, acceptSuggestion, discardSuggestion } = useGhostwriter(editor, isMobile);

    // Handle Tab key to accept suggestion
    useEffect(() => {
        if (!editor || !suggestion) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                acceptSuggestion();
            }
        };

        const view = editor.view;
        view.dom.addEventListener('keydown', handleKeyDown);

        return () => {
            view.dom.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor, suggestion, acceptSuggestion]);

    // Sync Editor with Store (Handling Restore)
    useEffect(() => {
        if (editor && currentDocument?.content) {
            // Simple check to prevent infinite loop of updates
            const currentEditorContent = JSON.stringify(editor.getJSON());
            const storeContent = JSON.stringify(currentDocument.content);

            if (currentEditorContent !== storeContent) {
                editor.commands.setContent(currentDocument.content);
            }
        }
    }, [currentDocument, editor]);

    const handleProcessWithAI = async () => {
        if (!editor) return;

        const text = extractPlainText(editor);
        if (!text) {
            toast.error("Editor kosong. Tulis sesuatu dulu!");
            return;
        }

        toast.info("Mengirim ke AI...", { description: "Sedang memproses dokumen Anda." });

        try {
            const result = await rag.processDocument(document.id, text);
            if (result.success) {
                toast.success("Sukses!", { description: result.message });
            } else {
                toast.warning("Gagal", { description: result.message });
            }
        } catch {
            toast.error("Error", { description: "Gagal menghubungkan ke RAG pipeline." });
        }
    };

    return (
        <div className={cn(
            "flex flex-1 gap-4 p-4 h-full",
            isMobile ? "flex-col" : "flex-row"
        )}>
            {/* PDF/Source View */}
            {!isMobile && pdfUrl && (
                <Card className="flex-1 bg-slate-50 dark:bg-[#0B1120]/40 border-slate-200 dark:border-blue-900/30 overflow-hidden flex flex-col glass-obsidian">
                    <div className="p-3 border-b border-slate-200 dark:border-blue-900/30 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium">Source Document</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground">
                        {/* Placeholder for PDF Viewer */}
                        <div className="text-center p-6">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>PDF Viewer Placeholder</p>
                            <p className="text-xs text-muted-foreground mt-1">{pdfUrl}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Editor View */}
            <Card className="flex-1 border-slate-200 dark:border-blue-900/30 flex flex-col bg-white/80 dark:bg-slate-950/95 overflow-hidden shadow-sm backdrop-blur-xl glass-obsidian">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-blue-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-[#0B1120]/60 backdrop-blur-sm">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Badge variant="outline" className="text-xs font-normal bg-white dark:bg-slate-800 shrink-0">
                                v{document.version}
                            </Badge>
                            <span className="text-sm font-medium text-foreground truncate">
                                {document.title}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground sm:hidden shrink-0">
                            {editor?.storage.characterCount.words() || 0} words
                        </span>
                    </div>

                    <div className="flex items-center justify-end w-full sm:w-auto gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
                            {editor?.storage.characterCount.words() || 0} words
                        </span>
                        <VersionHistory />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleProcessWithAI}
                            className="h-8 gap-1.5 flex-1 sm:flex-none text-purple-600 border-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="truncate">Analyze AI</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                onSave();
                                createSnapshot('Manual Save');
                            }}
                            className="h-8 gap-1.5 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                            <Save className="h-3.5 w-3.5" />
                            <span>Save</span>
                        </Button>
                    </div>
                </div>

                {/* Tiptap Toolbar */}
                <EditorToolbar editor={editor} />

                {/* Floating Menu */}
                <EditorBubbleMenu editor={editor} />

                {/* Ghostwriter Widget (AI Autocomplete) */}
                <GhostwriterWidget
                    suggestion={suggestion}
                    isLoading={isGhostwriterLoading}
                    onAccept={acceptSuggestion}
                    onDiscard={discardSuggestion}
                    isMobile={isMobile}
                />

                {/* Editor Area */}
                <div
                    className="flex-1 overflow-y-auto bg-white/60 dark:bg-[#0B1120]/80 backdrop-blur-sm group relative cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUwyMyAxNkwxNCAxOEw5IDMwTDEgMVoiIGZpbGw9IiMxMTE4MjciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4='),_default]"
                    onClick={() => editor?.chain().focus().run()}
                >
                    <EditorContent editor={editor} className="min-h-full" />
                </div>
            </Card>
        </div>
    );
}
