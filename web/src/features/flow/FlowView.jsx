import { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import StepNode from './StepNode';
import ZoomControls from './ZoomControls';
import FlowMiniMap from './FlowMiniMap';
import { useFlowData } from './useFlowData';

const nodeTypes = { agentNode: FlowNode, stepNode: StepNode };
const edgeTypes = { agentEdge: FlowEdge };

// Default to 100% zoom; user can use "Fit" button to zoom-to-fit
const DEFAULT_VIEWPORT = { x: 80, y: 80, zoom: 1.0 };

function FlowCanvas() {
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
      defaultViewport={DEFAULT_VIEWPORT}
      nodesDraggable={false}
      nodesConnectable={false}
      colorMode="dark"
      minZoom={0.08}
      maxZoom={2.5}
      style={{ background: '#09090c' }}
    >
      <Background variant={BackgroundVariant.Dots} color="#2e2e4a" gap={28} size={1.5} />
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
