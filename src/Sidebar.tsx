import React, { useState } from 'react';
import { Plus, FileText, Menu, X } from 'lucide-react';
import { blockTypes } from './config/blockTypes';
import { templates } from './config/templates';
import { useWorkflowStore } from './store/workflowStore';
import CreateNodeDialog from './nodes/CustomNodeDialog';

const Sidebar = () => {
  const { addNode, loadTemplate, addCustomBlockType } = useWorkflowStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

  const handleDragStart = (event: React.DragEvent, blockType: typeof blockTypes[0]) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(blockType));
  };

  const position = {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };

  const handleCreateCustomNode = (nodeConfig: {
    label: string;
    inputs: Record<string, string>;
    outputs: Record<string, string>;
  }) => {
    addCustomBlockType({
      label: nodeConfig.label,
      inputs: nodeConfig.inputs,
      outputs: nodeConfig.outputs,
    });
    console.log(nodeConfig);
    console.log('Custom Node Created');
  };

  return (
    <div className="flex h-screen transition-all">
      <div
        className={`bg-white border-r border-gray-200 p-4 overflow-y-auto shadow-lg transition-all flex flex-col
          ${isOpen ? 'w-64 md:w-72 lg:w-80 xl:w-88' : 'w-0 overflow-hidden'}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Blocks</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {isOpen && (
          <div className="space-y-6">
            <div>
              {/* <h2 className="text-lg font-semibold mb-4">Blocks</h2> */}
              <div className="space-y-2">
                {blockTypes.map((blockType) => (
                  <div
                    key={blockType.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, blockType)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 cursor-move hover:bg-gray-50 transition-colors"
                    onClick={() => addNode(blockType, position)}
                  >
                    <Plus size={16} className="text-gray-500" />
                    <span>{blockType.label}</span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus size={16} className="text-gray-500" />
                  <span>Custom Node</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                    className="flex items-center gap-2 w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                    title={`${template.name} - ${template.description}`}
                  >
                    <FileText size={16} className="text-gray-500 flex-shrink-0 mr-0.5" />
                    <div>
                      <div className="font-medium line-clamp-1">{template.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-3">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <CreateNodeDialog
              isOpen={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              onSubmit={handleCreateCustomNode}
            />
          </div>
        )}
      </div>

      {/* Toggle Sidebar Button (Hamburger icon outside when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 bg-blue-600 text-white p-2 rounded-md shadow-lg hover:bg-blue-700 transition z-50"
        >
          <Menu size={24} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
