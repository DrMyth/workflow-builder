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
  executionResults: Record<string, any>;
  executionStatus: Record<string, 'idle' | 'processing' | 'success' | 'error'>;
  runWorkflow: () => Promise<void>;
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
        blockTypeId: blockType.id,
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
  },

  executionResults: {},
  executionStatus: {},
  runWorkflow: async () => {
    const { nodes, edges, isValidConnection } = get();
    
    // Reset execution state
    set({
      executionResults: {},
      executionStatus: Object.fromEntries(nodes.map(node => [node.id, 'idle']))
    });

    // Topological sort implementation
    const sortedNodes = topologicalSort(nodes, edges);
    
    for (const node of sortedNodes) {
      try {
        set(state => ({
          executionStatus: { ...state.executionStatus, [node.id]: 'processing' }
        }));

        // Gather inputs from connected nodes
        const inputs = await gatherNodeInputs(node, edges, get().executionResults);
        
        // Find block type definition
        const blockType = [...blockTypes, ...get().customBlockTypes]
          .find(bt => bt.id === node.data.blockTypeId);
        
        if (!blockType?.mockFunction) {
          throw new Error(`No mock function found for ${node.data.label}`);
        }

        // Execute mock function
        const results = await blockType.mockFunction(inputs);
        
        set(state => ({
          executionResults: { ...state.executionResults, [node.id]: results },
          executionStatus: { ...state.executionStatus, [node.id]: 'success' }
        }));

      } catch (error) {
        console.error(`Error executing node ${node.id}:`, error);
        set(state => ({
          executionStatus: { ...state.executionStatus, [node.id]: 'error' }
        }));
      }
    }}
}));

async function gatherNodeInputs(node: Node, edges: Edge[], results: any) {
  const inputs: Record<string, any> = {};
  
  const inputConnections = edges.filter(edge => edge.target === node.id);
  for (const connection of inputConnections) {
    const sourceNodeResults = results[connection.source];
    if (sourceNodeResults && connection.sourceHandle) {
      inputs[connection.targetHandle!] = sourceNodeResults[connection.sourceHandle];
    }
  }
  
  return inputs;
}

function topologicalSort(nodes: Node[], edges: Edge[]) {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const inDegree = new Map(nodes.map(node => [node.id, 0]));
  const graph = new Map(nodes.map(node => [node.id, []]));

  edges.forEach(edge => {
    graph.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  const queue = nodes.filter(node => inDegree.get(node.id) === 0);
  const sorted: Node[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    sorted.push(node);
    
    graph.get(node.id)?.forEach(targetId => {
      inDegree.set(targetId, inDegree.get(targetId)! - 1);
      if (inDegree.get(targetId) === 0) {
        const targetNode = nodeMap.get(targetId);
        if (targetNode) queue.push(targetNode);
      }
    });
  }

  return sorted;
}