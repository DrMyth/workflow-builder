import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface Port {
  name: string;
  type: string;
}

interface CreateNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nodeConfig: {
    label: string;
    inputs: Record<string, string>;
    outputs: Record<string, string>;
  }) => void;
}

const CreateNodeDialog: React.FC<CreateNodeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [label, setLabel] = useState('');
  const [inputs, setInputs] = useState<Port[]>([{ name: '', type: 'string' }]);
  const [outputs, setOutputs] = useState<Port[]>([{ name: '', type: 'string' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputsObj = inputs.reduce((acc, input) => {
      if (input.name) acc[input.name] = input.type;
      return acc;
    }, {} as Record<string, string>);

    const outputsObj = outputs.reduce((acc, output) => {
      if (output.name) acc[output.name] = output.type;
      return acc;
    }, {} as Record<string, string>);

    onSubmit({
      label,
      inputs: inputsObj,
      outputs: outputsObj,
    });

    // Reset form
    setLabel('');
    setInputs([{ name: '', type: 'string' }]);
    setOutputs([{ name: '', type: 'string' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-1000 bg-gray-600/65 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Custom Node</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Node Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inputs
            </label>
            {inputs.map((input, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={input.name}
                  onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[index].name = e.target.value;
                    setInputs(newInputs);
                  }}
                  placeholder="Input name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={input.type}
                  onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[index].type = e.target.value;
                    setInputs(newInputs);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="pdf">PDF</option>
                  <option value="string[]">String Array</option>
                </select>
                {inputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setInputs(inputs.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outputs
            </label>
            {outputs.map((output, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={output.name}
                  onChange={(e) => {
                    const newOutputs = [...outputs];
                    newOutputs[index].name = e.target.value;
                    setOutputs(newOutputs);
                  }}
                  placeholder="Output name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={output.type}
                  onChange={(e) => {
                    const newOutputs = [...outputs];
                    newOutputs[index].type = e.target.value;
                    setOutputs(newOutputs);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="pdf">PDF</option>
                  <option value="string[]">String Array</option>
                </select>
                {outputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setOutputs(outputs.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNodeDialog;