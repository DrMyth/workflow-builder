import { create } from 'zustand';
import { Node, Edge, Connection, NodeChange, applyNodeChanges } from '@xyflow/react';
import { BlockType } from '../types/workflow';
import { blockTypes } from '../config/blockTypes';
import { templates } from '../config/templates';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  customBlockTypes: BlockType[];
  addNode: (type: BlockType, position: { x: number; y: number }) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  addEdge: (connection: Connection) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  loadTemplate: (templateId: string) => void;
  isValidConnection: (connection: Connection) => boolean;
  history: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  undo: () => void;
  redo: () => void;
  addCustomBlockType: (blockType: Omit<BlockType, 'id' | 'type'>) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  customBlockTypes: [],
  history: [],
  future: [],

  saveHistory: () => {
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
    }));
  },
  
  addNode: (blockType: BlockType, position) => {
    const newNode: Node = {
      id: `${blockType.id}-${Date.now()}`,
      type: 'customNode',
      position,
      data: {
        label: blockType.label,
        config: {},
        inputs: blockType.inputs,
        outputs: blockType.outputs
      }
    };
    
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      nodes: [...state.nodes, newNode]
    }));
  },

  addCustomBlockType: (blockType) => {
    const newBlockType: BlockType = {
      ...blockType,
      id: `custom-${Date.now()}`,
      type: 'custom'
    };

    const newNode: Node = {
      id: `${newBlockType.id}`,
      type: 'customNode',
      position: { x: 100, y: 100 }, // You can modify this default position
      data: {
        label: newBlockType.label,
        config: {},
        inputs: newBlockType.inputs || {},
        outputs: newBlockType.outputs || {}
      }
    };

    console.log(newBlockType);
    console.log('Custom Node Created from workflowstore');

    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      customBlockTypes: [...state.customBlockTypes, newBlockType],
      nodes: [...state.nodes, newNode]
    }));
  },
  
  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      )
    }));
  },

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) // ✅ Update node positions when dragged
    }));
  },
  
  isValidConnection: (connection: Connection) => {
    const { nodes } = get();
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode || !connection.sourceHandle || !connection.targetHandle) {
      return false;
    }

    const outputType = sourceNode.data.outputs[connection.sourceHandle];
    const inputType = targetNode.data.inputs[connection.targetHandle];
    
    return outputType === inputType;
  },
  
  addEdge: (connection: Connection) => {
    const isValid = get().isValidConnection(connection);
    if (!isValid) return;

    const edge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source || '',
      target: connection.target || '',
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };
    
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      edges: [...state.edges, edge]
    }));
  },
  
  removeNode: (nodeId) => {
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    }));
  },
  
  removeEdge: (edgeId) => {
    set((state) => ({
      history: [...state.history, { nodes: state.nodes, edges: state.edges }],
      future: [],
      edges: state.edges.filter((edge) => edge.id !== edgeId)
    }));
  },

  undo: () => {
    set((state) => {
      if (state.history.length === 0) return state;
      const prevState = state.history[state.history.length - 1];

      return {
        nodes: prevState.nodes,
        edges: prevState.edges,
        history: state.history.slice(0, -1),
        future: [{ nodes: state.nodes, edges: state.edges }, ...state.future]
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      const nextState = state.future[0];

      return {
        nodes: nextState.nodes,
        edges: nextState.edges,
        history: [...state.history, { nodes: state.nodes, edges: state.edges }],
        future: state.future.slice(1)
      };
    });
  },

  loadTemplate: (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
  
    set((state) => ({
      nodes: template.nodes.map((node) => ({
        ...node,
        data: node.data as unknown as Record<string, unknown>, // ✅ Ensure correct type
      })),
      edges: template.edges,
    }));
  }
  
}));