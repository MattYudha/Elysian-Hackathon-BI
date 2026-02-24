import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import { WorkflowState, WorkflowMeta, ExecutionState, UIState, WorkflowNodeData, NodeStatus } from './types';
import { executeWorkflow, getExecution } from '@/services/workflow.service';
import { toast } from 'sonner';


// Initial State
const initialMeta: WorkflowMeta = {
    workflowId: 'wf_' + Date.now(),
    name: 'Untitled Workflow',
    version: '1.0.0',
    status: 'draft',
};

const initialExecution: ExecutionState = {
    runId: null,
    status: 'idle',
    activeNodeId: null,
    nodeStatus: {},
    errors: {},
    results: {},
    logs: [],
};

const initialUI: UIState = {
    selectedNodeId: null,
    zoomLevel: 1,
};

const initialNodes: Node<WorkflowNodeData>[] = [
    {
        id: 'start-1',
        type: 'start',
        data: { label: 'Start Trigger' },
        position: { x: 250, y: 50 },
    },
];

export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            // Layer 0: Meta
            meta: initialMeta,

            // Layer 1: Graph
            nodes: initialNodes,
            edges: [],

            // Layer 2: UI
            ui: initialUI,

            // Layer 3: Execution
            execution: initialExecution,

            // --- Actions ---

            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),

            onNodesChange: (changes: NodeChange[]) => {
                // When nodes change (dragged, selected), we update state.
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                    meta: { ...get().meta, status: 'draft' } // Mark as draft on change
                });
            },

            onEdgesChange: (changes: EdgeChange[]) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            onConnect: (connection: Connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            addNode: (node: Node<WorkflowNodeData>) => {
                set({
                    nodes: [...get().nodes, node],
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            // UI Actions
            setSelectedNode: (id: string | null) => {
                set((state) => ({
                    ui: { ...state.ui, selectedNodeId: id },
                }));
            },

            // Logic & Validation
            isValidConnection: (connection: Edge | Connection) => {
                const { edges } = get();
                // 1. Connectivity Rules
                if (connection.source === connection.target) return false;

                // No duplicate edges
                const isDuplicate = edges.some(
                    (e) =>
                        e.source === connection.source &&
                        e.target === connection.target &&
                        e.sourceHandle === connection.sourceHandle &&
                        e.targetHandle === connection.targetHandle
                );
                if (isDuplicate) return false;

                return true;
            },

            updateNodeData: (nodeId, data) => {
                set({
                    nodes: get().nodes.map((node) => {
                        if (node.id === nodeId) {
                            return { ...node, data: { ...node.data, ...data } };
                        }
                        return node;
                    }),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            // Execution Actions
            startExecution: () => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        status: 'running',
                        runId: `run_${Date.now()}`,
                        errors: {},
                        results: {},
                        nodeStatus: {},
                    },
                }));
            },

            stopExecution: () => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        status: 'idle',
                        activeNodeId: null,
                    },
                }));
            },

            setNodeStatus: (nodeId: string, status: NodeStatus) => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        nodeStatus: {
                            ...state.execution.nodeStatus,
                            [nodeId]: status,
                        },
                    },
                }));
            },

            executeWorkflow: async () => {
                const { meta, startExecution, pollExecution } = get();
                startExecution(); // Resets local state

                try {
                    // Call API: POST /execute
                    const { executionId } = await executeWorkflow(meta.workflowId);

                    set((state) => ({
                        execution: {
                            ...state.execution,
                            runId: executionId,
                            status: 'running',
                        }
                    }));

                    toast.success("Workflow Execution Started", {
                        description: `Run ID: ${executionId}`
                    });

                    // Start polling
                    pollExecution();

                } catch (error) {
                    toast.error("Execution Failed", {
                        description: error instanceof Error ? error.message : "Unknown error"
                    });
                    set((state) => ({
                        execution: { ...state.execution, status: 'failed' }
                    }));
                }
            },

            pollExecution: async () => {
                const { execution } = get();
                if (!execution.runId || execution.status === 'completed' || execution.status === 'failed') return;

                try {
                    try {
                        // Call API: GET /execution/:id
                        const details = await getExecution(execution.runId);

                        const nodeStatus: Record<string, NodeStatus> = { ...execution.nodeStatus };
                        const logs = details.logs || [];

                        // Parse Logs to update Node Status
                        logs.forEach(log => {
                            // Logic: If we see a log for a node, it means it started/finished.
                            // Ideally backend sends explicit node status updates, but parsing logs works for MVP.
                            if (log.nodeId && log.level !== 'ERROR') {
                                nodeStatus[log.nodeId] = 'success';
                            }
                            if (log.nodeId && log.level === 'ERROR') {
                                nodeStatus[log.nodeId] = 'error';
                            }
                        });

                        // Update Status
                        const mappedStatus = details.status.toLowerCase() as ExecutionState['status'];

                        set((state) => ({
                            execution: {
                                ...state.execution,
                                status: mappedStatus,
                                nodeStatus: nodeStatus,
                                // Store results if completed
                                results: details.results || {}
                            }
                        }));

                        // Continue Polling if not finished
                        if (details.status === 'PENDING' || details.status === 'RUNNING') {
                            setTimeout(() => get().pollExecution(), 1500); // 1.5s interval
                        } else {
                            // Finished
                            if (details.status === 'COMPLETED') {
                                toast.success("Execution Completed");
                            } else if (details.status === 'FAILED') {
                                toast.error("Execution Failed");
                            }
                        }
                    } catch (error) {
                        console.error("Polling error", error);
                        // Don't stop polling immediately on one error, maybe network blip
                        // But if 404, maybe stop. For now, simple retry logic is implicitly handled by user re-click or ignoring.
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
            },




            // Persistence Actions
            publishVersion: () => {
                set((state) => {
                    const [major, minor, patch] = state.meta.version.split('.').map(Number);
                    // Simple patch increment for now
                    const newVersion = `${major}.${minor}.${patch + 1}`;
                    return {
                        meta: {
                            ...state.meta,
                            version: newVersion,
                            status: 'published',
                        },
                        // Reset execution state on publish
                        execution: { ...initialExecution },
                    };
                });
            },

            // Computed Getters (Mocking them as properties for now, ideally strictly typed getters)
            get selectedNode() {
                const state = get();
                return state.nodes.find((n) => n.id === state.ui.selectedNodeId) || null;
            },
        }),
        {
            name: 'elysian-workflow-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                nodes: state.nodes,
                edges: state.edges,
                meta: state.meta
            }),
        }
    )
);
