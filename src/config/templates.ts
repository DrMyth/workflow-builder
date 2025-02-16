import { Node, Edge } from "@xyflow/react";
import { NodeData } from "../types/workflow";

interface Template {
  id: string;
  name: string;
  description: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export const templates: Template[] = [
  {
    id: "pdf-to-summary",
    name: "PDF to Summary",
    description:
      "Extract text from PDF, analyze content, and generate a summary",
    nodes: [
      {
        id: "pdf-parser-1",
        type: "customNode",
        position: { x: 100, y: 100 },
        data: {
          label: "PDF Parser",
          config: {},
          inputs: { file: "pdf" },
          outputs: { text: "string" },
        },
      },
      {
        id: "language-detector-1",
        type: "customNode",
        position: { x: 400, y: -100 },
        data: {
          label: "Language Detector",
          config: {},
          inputs: { text: "string" },
          outputs: { language: "string" },
        },
      },
      {
        id: "sentiment-analyzer-1",
        type: "customNode",
        position: { x: 400, y: 300 },
        data: {
          label: "Sentiment Analyzer",
          config: {},
          inputs: { text: "string" },
          outputs: { sentiment: "string" },
        },
      },
      {
        id: "summarizer-1",
        type: "customNode",
        position: { x: 400, y: 100 },
        data: {
          label: "Text Summarizer",
          config: {},
          inputs: { text: "string" },
          outputs: { summary: "string" },
        },
      },
      {
        id: "keyword-extractor-1",
        type: "customNode",
        position: { x: 700, y: 100 },
        data: {
          label: "Keyword Extractor",
          config: {},
          inputs: { text: "string" },
          outputs: { keywords: "string[]" },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "pdf-parser-1",
        target: "language-detector-1",
        sourceHandle: "text",
        targetHandle: "text",
      },
      {
        id: "e1-3",
        source: "pdf-parser-1",
        target: "sentiment-analyzer-1",
        sourceHandle: "text",
        targetHandle: "text",
      },
      {
        id: "e1-4",
        source: "pdf-parser-1",
        target: "summarizer-1",
        sourceHandle: "text",
        targetHandle: "text",
      },
      {
        id: "e4-5",
        source: "summarizer-1",
        target: "keyword-extractor-1",
        sourceHandle: "summary",
        targetHandle: "text",
      },
    ],
  },
  {
    id: "document-processing-workflow",
    name: "Document Processing Workflow",
    description:
      "Processes a document, extracts text, splits words, and summarizes",
    nodes: [
      {
        id: "api-call",
        type: "customNode",
        position: { x: 0, y: 0 },
        data: {
          label: "API Call",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { FILE: "pdf" },
        },
      },
      {
        id: "pdf-parser",
        type: "customNode",
        position: { x: 300, y: 0 },
        data: {
          label: "PDF Parser",
          config: {},
          inputs: { FILE: "pdf" },
          outputs: { TEXT: "string" },
        },
      },
      {
        id: "text-to-words-1",
        type: "customNode",
        position: { x: 600, y: -200 },
        data: {
          label: "Text to Array of Words",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { WORDS: "string[]" },
        },
      },
      {
        id: "text-to-words-2",
        type: "customNode",
        position: { x: 900, y: 0 },
        data: {
          label: "Text to Array of Words",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { WORDS: "string[]" },
        },
      },
      {
        id: "text-summarizer",
        type: "customNode",
        position: { x: 600, y: 200 },
        data: {
          label: "Text Summarizer",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { SUMMARY: "string" },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "api-call",
        target: "pdf-parser",
        sourceHandle: "FILE",
        targetHandle: "FILE",
      },
      {
        id: "e2-3",
        source: "pdf-parser",
        target: "text-to-words-1",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e2-5",
        source: "pdf-parser",
        target: "text-summarizer",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e3-4",
        source: "text-summarizer",
        target: "text-to-words-2",
        sourceHandle: "SUMMARY",
        targetHandle: "TEXT",
      },
    ],
  },

  {
    id: "ai-multi-step",
    name: "AI Multi-Step Workflow",
    description:
      "Extracts text, splits it, sends to multiple AI models, and generates insights",
    nodes: [
      {
        id: "pdf-parser-ai",
        type: "customNode",
        position: { x: 100, y: 100 },
        data: {
          label: "PDF Parser",
          config: {},
          inputs: { file: "pdf" },
          outputs: { text: "string" },
        },
      },
      {
        id: "text-to-words-ai",
        type: "customNode",
        position: { x: 400, y: 100 },
        data: {
          label: "Text to Array of Words",
          config: {},
          inputs: { text: "string" },
          outputs: { words: "string[]" },
        },
      },
      {
        id: "api-call-ai-1",
        type: "customNode",
        position: { x: 700, y: -100 },
        data: {
          label: "AI Analysis Model 1",
          config: {},
          inputs: { text: "string" },
          outputs: { insights: "string" },
        },
      },
      {
        id: "api-call-ai-2",
        type: "customNode",
        position: { x: 700, y: 300 },
        data: {
          label: "AI Analysis Model 2",
          config: {},
          inputs: { text: "string" },
          outputs: { insights: "string" },
        },
      },
      {
        id: "summarizer-ai",
        type: "customNode",
        position: { x: 1000, y: 125 },
        data: {
          label: "Text Summarizer",
          config: {},
          inputs: { text: "string" },
          outputs: { summary: "string" },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "pdf-parser-ai",
        target: "text-to-words-ai",
        sourceHandle: "text",
        targetHandle: "text",
      },
      {
        id: "e2-3",
        source: "text-to-words-ai",
        target: "api-call-ai-1",
        sourceHandle: "words",
        targetHandle: "text",
      },
      {
        id: "e2-4",
        source: "text-to-words-ai",
        target: "api-call-ai-2",
        sourceHandle: "words",
        targetHandle: "text",
      },
      {
        id: "e3-5",
        source: "api-call-ai-1",
        target: "summarizer-ai",
        sourceHandle: "insights",
        targetHandle: "text",
      },
      {
        id: "e4-5",
        source: "api-call-ai-2",
        target: "summarizer-ai",
        sourceHandle: "insights",
        targetHandle: "text",
      },
    ],
  },
  {
    id: "advanced-document-processing",
    name: "Advanced Document Processing",
    description:
      "Processes documents, extracts text, detects language, performs sentiment analysis, summarizes, and extracts keywords.",
    nodes: [
      {
        id: "api-call",
        type: "customNode",
        position: { x: 0, y: 0 },
        data: {
          label: "API Call",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { FILE: "pdf" },
        },
      },
      {
        id: "pdf-parser",
        type: "customNode",
        position: { x: 300, y: 0 },
        data: {
          label: "PDF Parser",
          config: {},
          inputs: { FILE: "pdf" },
          outputs: { TEXT: "string" },
        },
      },
      {
        id: "ocr-processor",
        type: "customNode",
        position: { x: 600, y: -150 },
        data: {
          label: "OCR Processor",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { TEXT: "string" },
        },
      },
      {
        id: "language-detector",
        type: "customNode",
        position: { x: 600, y: 150 },
        data: {
          label: "Language Detector",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { LANGUAGE: "string" },
        },
      },
      {
        id: "sentiment-analysis",
        type: "customNode",
        position: { x: 900, y: -300 },
        data: {
          label: "Sentiment Analysis",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { SENTIMENT: "string" },
        },
      },
      {
        id: "text-summarizer",
        type: "customNode",
        position: { x: 900, y: 0 },
        data: {
          label: "Text Summarizer",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { SUMMARY: "string" },
        },
      },
      {
        id: "keyword-extractor",
        type: "customNode",
        position: { x: 1200, y: -100 },
        data: {
          label: "Keyword Extractor",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { KEYWORDS: "string[]" },
        },
      },
      {
        id: "text-to-words",
        type: "customNode",
        position: { x: 1200, y: 100 },
        data: {
          label: "Text to Array of Words",
          config: {},
          inputs: { TEXT: "string" },
          outputs: { WORDS: "string[]" },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "api-call",
        target: "pdf-parser",
        sourceHandle: "FILE",
        targetHandle: "FILE",
      },
      {
        id: "e2-3",
        source: "pdf-parser",
        target: "ocr-processor",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e2-4",
        source: "pdf-parser",
        target: "language-detector",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e3-5",
        source: "ocr-processor",
        target: "sentiment-analysis",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e3-6",
        source: "ocr-processor",
        target: "text-summarizer",
        sourceHandle: "TEXT",
        targetHandle: "TEXT",
      },
      {
        id: "e6-7",
        source: "text-summarizer",
        target: "keyword-extractor",
        sourceHandle: "SUMMARY",
        targetHandle: "TEXT",
      },
      {
        id: "e6-8",
        source: "text-summarizer",
        target: "text-to-words",
        sourceHandle: "SUMMARY",
        targetHandle: "TEXT",
      },
    ],
  },
];
