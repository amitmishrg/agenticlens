import { create } from 'zustand';

const useAgentStore = create((set) => ({
  nodes: [],
  tree: [],
  selectedNode: null,
  view: 'flow',
  collapsed: new Set(),

  setNodes: (nodes) => set({ nodes }),
  setTree: (tree) => set({ tree }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setView: (view) => set({ view }),

  toggleCollapse: (id) =>
    set((state) => {
      const next = new Set(state.collapsed);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { collapsed: next };
    }),

  collapseAll: (ids) =>
    set(() => ({
      collapsed: new Set(ids),
    })),

  expandAll: () =>
    set(() => ({
      collapsed: new Set(),
    })),
}));

export default useAgentStore;
