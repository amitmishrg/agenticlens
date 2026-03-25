# AgentScope

A local devtool to visualize Claude Agent SDK JSONL logs. Run it with a single command and get a rich, interactive UI in your browser.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Run against a JSONL file
node cli/index.js path/to/logs.jsonl
```

> Once the server starts, your browser will open automatically at `http://localhost:3000`.

---

## Project Structure

```
agentscope/
├── cli/
│   ├── index.js        — CLI entry point (validates file, calls server)
│   └── server.js       — Express server (serves UI + /data endpoint)
│
└── web/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx             — Root component (data fetching + layout)
        ├── main.jsx            — React entry point
        ├── components/
        │   ├── Toolbar.jsx     — Top bar (view toggle, collapse all)
        │   ├── TreeView.jsx    — Hierarchical event tree
        │   ├── TreeNode.jsx    — Recursive tree node
        │   ├── TimelineView.jsx— Flat chronological list with deltas
        │   └── InspectorPanel.jsx — Selected node detail + raw JSON
        ├── store/
        │   └── useAgentStore.js — Zustand store
        ├── parser/
        │   ├── parseJSONL.js   — JSONL → normalized node array
        │   └── buildTree.js    — Flat nodes → hierarchical tree
        └── styles/
            └── tailwind.css    — Tailwind directives + scrollbar styles
```

---

## JSONL Format

AgentScope understands Claude Agent SDK log lines. Each line should be valid JSON. Supported types:

| Type          | Color  | Description                        |
|---------------|--------|------------------------------------|
| `user`        | Blue   | User message                       |
| `assistant`   | Green  | Assistant response                 |
| `thinking`    | Yellow | Internal reasoning block           |
| `system`      | Purple | System prompt                      |
| `tool_use`    | Orange | Tool call                          |
| `tool_result` | Teal   | Result of a tool call              |
| `progress`    | Cyan   | Progress event                     |
| `result`      | Gray   | Final result with optional metrics |

**Optional fields for richer UI:**

```jsonl
{ "uuid": "abc-123", "parentUuid": "xyz-000", "role": "assistant", "content": [...], "timestamp": "2024-01-01T00:00:00Z", "usage": { "input_tokens": 100, "output_tokens": 50 }, "model": "claude-3-5-sonnet-20241022" }
```

Fields:
- `uuid` + `parentUuid` — enables parent-child tree linking
- `timestamp` — enables timeline ordering + delta display
- `usage` — shows token counts in Inspector
- `model`, `duration_ms`, `stop_reason` — show in Inspector metadata

---

## UI Features

- **Tree View** — Hierarchical display of events. Click any node to inspect it.
- **Timeline View** — Flat chronological list with time deltas between events.
- **Inspector Panel** — Shows type, timestamp, metadata (tokens, cost, duration), and full raw JSON.
- **Collapse / Expand** — Collapse or expand all tree nodes via the toolbar.

---

## Development

To run the web app in dev mode with hot reload (requires CLI server running separately):

```bash
# Terminal 1 — start CLI server
node cli/index.js sample-logs.jsonl

# Terminal 2 — start Vite dev server
cd web && npm run dev
```

The Vite dev server proxies `/data` requests to `http://localhost:3000`.

---

## Sample Logs

A sample `sample-logs.jsonl` file is included for testing.

```bash
node cli/index.js sample-logs.jsonl
```

---

## Tech Stack

- **React 18** + **Vite** — fast frontend
- **Tailwind CSS** — utility-first styling
- **Zustand** — minimal state management
- **Express** — lightweight Node.js server
- **open** — cross-platform browser launcher
