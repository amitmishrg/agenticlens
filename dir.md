web/src/
├── App.jsx (97 lines)
├── main.jsx
│
├── constants/
│ └── typeConfig.js — shared accent colours + getAccent()
│
├── components/ — global reusable only
│ ├── TypeIcon.jsx — SVG icons for each event type
│ ├── Toolbar.jsx — view switcher bar
│ ├── toolbarViews.jsx — VIEWS array (icons + ids)
│ ├── SlidePane.jsx — sliding inspector overlay
│ └── SlidePaneHeader.jsx — header inside the pane
│
├── store/
│ └── useAgentStore.js — Zustand (unchanged)
│
├── parser/
│ ├── parseJSONL.js — orchestrator (uses the 3 below)
│ ├── typeResolver.js — resolveType()
│ ├── labelExtractor.js — extractLabel()
│ ├── metaExtractor.js — extractMeta()
│ ├── contentUtils.js — getContent(), truncate(), extractBodyText()
│ └── buildTree.js — flat → tree
│
└── features/ — all feature code lives here
├── flow/
│ ├── FlowView.jsx — ReactFlow canvas + provider
│ ├── FlowNode.jsx — custom RF node (card)
│ ├── FlowEdge.jsx — animated bezier edge + traveling dot
│ ├── ZoomControls.jsx — zoom in/out, 1:1, fit buttons
│ ├── useFlowData.js — converts store tree → RF nodes/edges
│ └── flowLayout.js — recursive tree layout algorithm
├── cards/
│ ├── CardView.jsx
│ ├── AgentCard.jsx
│ ├── FilterBar.jsx
│ ├── MetaChip.jsx
│ └── useCardFilter.js
├── timeline/
│ ├── TimelineView.jsx
│ └── TimelineItem.jsx
├── tree/
│ ├── TreeView.jsx
│ └── TreeNode.jsx
└── inspector/
├── InspectorPanel.jsx
├── MetaSection.jsx
├── MetaRow.jsx
└── JsonViewer.jsx
