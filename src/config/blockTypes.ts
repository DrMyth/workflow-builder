import { BlockType } from '../types/workflow';

export const blockTypes: BlockType[] = [
  {
    id: 'pdf-parser',
    label: 'PDF Parser',
    type: 'file_processing',
    inputs: {
      file: 'pdf'
    },
    outputs: {
      text: 'string'
    }
  },
  {
    id: 'text-to-words',
    label: 'Text to Array of Words',
    type: 'text_processing',
    inputs: {
      text: 'string'
    },
    outputs: {
      words: 'string[]'
    }
  },
  {
    id: 'summarizer',
    label: 'Text Summarizer',
    type: 'ai_processing',
    inputs: {
      text: 'string'
    },
    outputs: {
      summary: 'string'
    }
  },
  {
    id: 'api-call-tool',
    label: 'API Call',
    type: 'ai_processing',
    inputs: {
      text: 'string'
    },
    outputs: {
      file: 'pdf'
    }
  }
];