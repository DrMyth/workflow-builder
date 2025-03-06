import { BlockType } from '../types/workflow';

export const blockTypes: BlockType[] = [
  {
    id: 'pdf-parser',
    label: 'PDF Parser',
    type: 'file_processing',
    inputs: { file: 'pdf' },
    outputs: { text: 'string' },
    mockFunction: async (inputs) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        text: "Mock PDF content: Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      };
    }
  },
  {
    id: 'text-to-words',
    label: 'Text to Array of Words',
    type: 'text_processing',
    inputs: { text: 'string' },
    outputs: { words: 'string[]' },
    mockFunction: async (inputs) => ({
      words: inputs.text.split(/\s+/).filter(word => word.length > 0)
    })
  },
  {
    id: 'summarizer',
    label: 'Text Summarizer',
    type: 'ai_processing',
    inputs: { text: 'string' },
    outputs: { summary: 'string' },
    mockFunction: async (inputs) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const sentences = inputs.text.match(/[^.!?]+[.!?]+/g) || [];
      return { summary: sentences.slice(0, 2).join(' ') + '...' };
    }
  },
  {
    id: 'api-call-tool',
    label: 'API Call',
    type: 'ai_processing',
    inputs: { text: 'string' },
    outputs: { file: 'pdf' },
    mockFunction: async (inputs) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        file: `generated-${Date.now()}.pdf`,
        content: inputs.text
      };
    }
  },
  {
    id: 'language-detector',
    label: 'Language Detector',
    type: 'text_processing',
    inputs: { text: 'string' },
    outputs: { language: 'string' },
    mockFunction: async () => ({
      language: 'English' 
    })
  },
  {
    id: 'sentiment-analyzer',
    label: 'Sentiment Analyzer',
    type: 'ai_processing',
    inputs: { text: 'string' },
    outputs: { sentiment: 'string' },
    mockFunction: async () => ({
      sentiment: Math.random() > 0.5 ? 'Positive' : 'Negative'
    })
  },
  {
    id: 'keyword-extractor',
    label: 'Keyword Extractor',
    type: 'text_processing',
    inputs: { text: 'string' },
    outputs: { keywords: 'string[]' },
    mockFunction: async (inputs) => ({
      keywords: inputs.text.split(/\s+/).slice(0, 5)
    })
  },
  {
    id: 'ocr-processor',
    label: 'OCR Processor',
    type: 'file_processing',
    inputs: { text: 'string' },
    outputs: { text: 'string' },
    mockFunction: async (inputs) => ({
      text: inputs.text
    })
  },
  {
    id: 'ai-analysis-model-1',
    label: 'AI Analysis Model 1',
    type: 'ai_processing',
    inputs: { text: 'string' },
    outputs: { insights: 'string' },
    mockFunction: async (inputs) => ({
      insights: `Processed: ${inputs.text.slice(0, 50)}...`
    })
  },
  {
    id: 'ai-analysis-model-2',
    label: 'AI Analysis Model 2',
    type: 'ai_processing',
    inputs: { text: 'string' },
    outputs: { insights: 'string' },
    mockFunction: async (inputs) => ({
      insights: `Analysis: ${inputs.text.split(' ').length} words`
    })
  }
];