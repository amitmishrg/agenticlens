import { create } from 'zustand';

let flashClearTimerId = null;

const FILTER_TYPES = [
  'all',
  'user',
  'assistant',
  'thinking',
  'system',
  'result',
  'tool_use',
  'tool_result',
  'progress',
  'queue-operation',
  'last-prompt',
];

export default create((set, get) => ({
  nodes: [],
  tree: [],
  steps: [],
  sessionSummary: null,
  workspaceFiles: [], // [{ name, content }]
  activeFileIndex: 0,
  isUploadPanelOpen: false,
  chronNodeIds: [],
  selectedNode: null,
  selectedNodeId: null,
  /** Sample trace loaded from /sample.jsonl (no CLI/workspace). */
  isSampleSession: false,
  /** React Flow: last focus request for fitView zoom (nonce forces effect). */
  flowFocus: null,
  /** Temporary emphasis ring on a node id (~2s). */
  flashNodeId: null,
  view: 'flow',

  collapsedNodeIds: new Set(),

  filterType: 'all',

  /** Replay: index into chronNodeIds; -1 = show full session (after filters). */
  currentStepIndex: -1,
  isPlaying: false,

  setNodes: (nodes) => set({ nodes }),
  setTree: (tree) => set({ tree }),
  setSteps: (steps) => set({ steps }),
  setSessionSummary: (sessionSummary) => set({ sessionSummary }),
  setWorkspaceFiles: (workspaceFiles) => set({ workspaceFiles }),
  setActiveFile: (activeFileIndex) => set({ activeFileIndex }),
  setWorkspaceFileContent: (index, content) =>
    set((state) => {
      const next = [...state.workspaceFiles];
      if (!next[index]) return state;
      next[index] = { ...next[index], content };
      return { workspaceFiles: next };
    }),
  openUploadPanel: () => set({ isUploadPanelOpen: true }),
  closeUploadPanel: () => set({ isUploadPanelOpen: false }),
  setChronNodeIds: (chronNodeIds) => set({ chronNodeIds }),
  setSelectedNode: (node) =>
    set({ selectedNode: node, selectedNodeId: node?.id ?? null }),
  setSelectedNodeId: (selectedNodeId) => {
    const node = selectedNodeId ? get().nodes.find((n) => n.id === selectedNodeId) : null;
    set({ selectedNodeId: selectedNodeId ?? null, selectedNode: node });
  },
  setIsSampleSession: (isSampleSession) => set({ isSampleSession }),
  setView: (view) => set({ view }),

  /**
   * Inspector selection + scroll (tree/timeline) + animated zoom (flow) + short glow.
   */
  focusNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    set({
      selectedNode: node,
      selectedNodeId: nodeId,
      flashNodeId: nodeId,
      flowFocus: { nodeId, nonce: Date.now() },
    });
    queueMicrotask(() => {
      document.getElementById(`al-focus-${nodeId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
    if (flashClearTimerId) clearTimeout(flashClearTimerId);
    flashClearTimerId = setTimeout(() => {
      flashClearTimerId = null;
      set({ flashNodeId: null });
    }, 2000);
  },

  setFilterType: (filterType) => set({ filterType }),

  toggleNode: (id) =>
    set((state) => {
      const next = new Set(state.collapsedNodeIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { collapsedNodeIds: next };
    }),

  collapseAll: (ids) => set({ collapsedNodeIds: new Set(ids) }),

  expandAll: () => set({ collapsedNodeIds: new Set() }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  nextStep: () => {
    const { chronNodeIds, currentStepIndex } = get();
    if (currentStepIndex < 0) {
      set({ currentStepIndex: 0 });
      return;
    }
    if (currentStepIndex < chronNodeIds.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) set({ currentStepIndex: currentStepIndex - 1 });
    else if (currentStepIndex === 0) set({ currentStepIndex: -1, isPlaying: false });
  },

  resetReplay: () => set({ currentStepIndex: -1, isPlaying: false }),
}));

export { FILTER_TYPES };
