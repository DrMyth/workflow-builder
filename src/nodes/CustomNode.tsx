import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { NodeData } from '../types/workflow';

const CustomNode = ({ id, data }: NodeProps<NodeData>) => {
  const removeNode = useWorkflowStore((state) => state.removeNode);

  return (
    <div className="relative bg-white/30 backdrop-blur-sm border border-white/20 
                    shadow-lg rounded-2xl p-5 min-w-[220px] max-w-[300px] 
                    flex flex-col gap-3 transition-all hover:scale-101">
      
      {/* Node Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-800">{data.label}</h3>
        <button
          onClick={() => removeNode(id)}
          className="text-red-500 hover:text-red-700 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Inputs Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">Inputs</p>
        {Object.entries(data.inputs).map(([key, type]) => (
          <div key={`input-${key}`} className="flex items-center gap-2">
            <Handle
              type="target"
              position={Position.Left}
              id={key}
              className="custom-handle-input"
            />
            <span className="text-xs text-gray-700 font-medium">
              {key.toUpperCase()} <span className="text-gray-400">({type})</span>
            </span>
          </div>
        ))}
      </div>

      {/* Outputs Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">Outputs</p>
        {Object.entries(data.outputs).map(([key, type]) => (
          <div key={`output-${key}`} className="flex items-center justify-between">
            <span className="text-xs text-gray-700 font-medium">
              {key.toUpperCase()} <span className="text-gray-400">({type})</span>
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={key}
              className="custom-handle-output"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CustomNode);
