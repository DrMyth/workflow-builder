export interface NodeData {
    label: string;
    config: Record<string, any>;
    inputs: Record<string, string>;
    outputs: Record<string, string>;
  }
  
  export interface WorkflowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
  }
  
  export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
  }
  
  export interface BlockType {
    id: string;
    label: string;
    type: string;
    inputs: { [key: string]: string };
    outputs: { [key: string]: string };
  }