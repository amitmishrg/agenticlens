import { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useThemeStore } from '@/store/useThemeStore';
import useAgentStore from '@/store/useAgentStore';
import FlowNode from '@/features/flow/FlowNode';
import FlowEdge from '@/features/flow/FlowEdge';
import StepNode from '@/features/flow/StepNode';
import ZoomControls from '@/features/flow/ZoomControls';
import FlowMiniMap from '@/features/flow/FlowMiniMap';
import { useFlowData } from '@/features/flow/useFlowData';

const nodeTypes = { agentNode: FlowNode, stepNode: StepNode };
const edgeTypes = { agentEdge: FlowEdge };

function FlowFocusHandler() {
  const flowFocus = useAgentStore((s) => s.flowFocus);
  const view = useAgentStore((s) => s.view);
  const rf = useReactFlow();

  useEffect(() => {
    if (view !== 'flow' || !flowFocus?.nodeId) return;
    if (!rf.getNode(flowFocus.nodeId)) return;

    const id = requestAnimationFrame(() => {
      rf.fitView({
        nodes: [{ id: flowFocus.nodeId }],
        duration: 280,
        padding: 0.33,
        minZoom: 0.18,
        maxZoom: 2.2,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [flowFocus?.nonce, flowFocus?.nodeId, view, rf]);

  return null;
}

function FlowCanvas() {
  const theme = useThemeStore((s) => s.theme);
  const { rfNodes, rfEdges } = useFlowData();
  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  useEffect(() => {
    setNodes(rfNodes);
  }, [rfNodes, setNodes]);
  useEffect(() => {
    setEdges(rfEdges);
  }, [rfEdges, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.24, minZoom: 0.08, maxZoom: 2.5, duration: 280 }}
      nodesDraggable
      nodesConnectable={false}
      colorMode={theme === 'dark' ? 'dark' : 'light'}
      minZoom={0.08}
      maxZoom={2.5}
      style={{ background: 'var(--app-bg)' }}
    >
      <FlowFocusHandler />
      <Background
        variant={BackgroundVariant.Dots}
        color="var(--app-dot-grid)"
        gap={28}
        size={1.5}
      />
      <ZoomControls />
      <FlowMiniMap />
    </ReactFlow>
  );
}

export default function FlowView() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
