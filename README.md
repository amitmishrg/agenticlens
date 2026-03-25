# AgenticLens

**See inside your AI agents.**

AgenticLens is a devtool that helps you **visualize, debug, and understand AI agent workflows** from JSONL logs.

It turns raw agent logs into an interactive UI with flow diagrams, timelines, replay, and insights — so you can quickly find what’s happening and what’s going wrong.

---

## ✨ Why AgenticLens?

Debugging AI agents is hard.

- Logs are messy
- Flows are invisible
- Performance issues are hard to spot

AgenticLens makes it easy to:

- 🧠 Understand agent reasoning (thinking steps)
- 🌊 Visualize full execution flow
- ⏱ Identify slow steps and bottlenecks
- 🔥 Detect high token usage
- 🔍 Inspect every step in detail
- ⏯ Replay agent execution step-by-step

---

## 🚀 Quick Start

```bash
npx agenticlens path/to/logs.jsonl
```

Your browser will open automatically with the full visualization.

---

## 📂 Upload Mode (No CLI needed)

You can also:

- Upload a `.jsonl` file
- Upload a folder with multiple sessions

Then explore each session directly in the UI.

---

## 🧩 Features

### 🌊 Flow View

Visual graph of your agent execution — see how each step connects.

### 🌳 Tree View

Structured hierarchy of all events and sub-steps.

### ⏱ Timeline View

Understand latency and execution order at a glance.

### 🔁 Replay Mode

Step through execution like a debugger.

### 📊 Session Summary

See total time, tokens, steps, and detected issues instantly.

### 🚨 Anomaly Detection

- Slow steps
- High token usage
- Performance bottlenecks

### 🔍 Inspector Panel

Deep dive into any node:

- metadata
- tokens
- raw JSON
- timestamps

---

## 🎯 Supported Logs

Currently supports:

- Claude Agent SDK JSONL logs

Coming soon:

- OpenAI Agents
- Custom agent frameworks
- SDK-based integrations

---

## 🛠 Use Cases

- Debugging agent workflows
- Understanding reasoning and tool usage
- Optimizing latency and cost
- Comparing different runs
- Building reliable AI systems

---

## 🔮 Roadmap

- SDK integration (`agenticlens.init()`)
- Chrome DevTools extension
- Multi-provider support (OpenAI, others)
- Run comparison
- Cloud dashboard

---

## ⚡ Philosophy

AI agents shouldn’t be a black box.

AgenticLens helps you treat them like real systems —
**observable, debuggable, and understandable.**

---

## 🧑‍💻 Development (optional)

```bash
npm install
npm run build
node cli/index.js sample-logs.jsonl
```

---

## 📜 License

MIT
