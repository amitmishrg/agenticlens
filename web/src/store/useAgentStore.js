import { create } from 'zustand';

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
  chronNodeIds: [],
  selectedNode: null,
  view: 'flow',

  collapsedNodeIds: new Set(),

  filterType: 'all',

  /** Replay: index into chronNodeIds; -1 = show full session (after filters). */
  currentStepIndex: -1,
  isPlaying: false,

  setNodes: (nodes) => set({ nodes }),
  setTree: (tree) => set({ tree }),
  setSteps: (steps) => set({ steps }),
  setChronNodeIds: (chronNodeIds) => set({ chronNodeIds }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setView: (view) => set({ view }),

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
