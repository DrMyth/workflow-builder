import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  NodeTypes,
  ReactFlowProvider,
  Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes } from './nodes';
import { initialEdges, edgeTypes } from './edges';

import { useWorkflowStore } from './store/workflowStore';
import CustomNode from './nodes/CustomNode';
import Sidebar from './Sidebar';
import { BlockType } from './types/workflow';

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

function Flow() {
  const { nodes, edges, addNode, addEdge, isValidConnection, onNodesChange } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const blockType: BlockType = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        );

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        addNode(blockType, position);
        console.log(nodes);
        console.log(edges);
      }
    },
    [addNode]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (isValidConnection(params)) {
        addEdge(params);
      }
    },
    [addEdge, isValidConnection]
  );

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodesChange={onNodesChange} 
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  const { undo, redo, history, future, runWorkflow } = useWorkflowStore();


  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
      <button
          onClick={() => runWorkflow()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Run Workflow
        </button>
      <button
        onClick={undo}
        disabled={history.length === 0}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Undo
      </button>

      <button
        onClick={redo}
        disabled={future.length === 0}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Redo
      </button>
    </div>
    </div>
  );
}
