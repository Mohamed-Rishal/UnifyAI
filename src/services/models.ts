import { ModelType } from '../types';

// Simulated model data
const models: ModelType[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'OpenAI\'s most advanced model with improved reasoning and knowledge cutoff in 2023',
    capabilities: ['Text Generation', 'Code Generation', 'Reasoning', 'Creative Writing'],
    costPer1kTokens: 0.02,
    maxTokens: 4096,
    contextWindow: 128000,
    inputCostPer1kTokens: 0.01,
    outputCostPer1kTokens: 0.03,
    logoUrl: '/models/openai-logo.svg',
    badge: 'Premium',
    strengths: ['Reasoning', 'Knowledge', 'Code Generation'],
    weaknesses: ['Hallucinations', 'Cost'],
    elo: 1800,
    popularity: 95,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Anthropic\'s most powerful model with industry-leading reasoning and accuracy',
    capabilities: ['Text Generation', 'Code Generation', 'Complex Reasoning'],
    costPer1kTokens: 0.03,
    maxTokens: 4096,
    contextWindow: 200000,
    inputCostPer1kTokens: 0.015,
    outputCostPer1kTokens: 0.075,
    logoUrl: '/models/anthropic-logo.svg',
    badge: 'Enterprise',
    strengths: ['Factual Accuracy', 'Following Instructions', 'Long Context'],
    weaknesses: ['Cost', 'Speed'],
    elo: 1780,
    popularity: 80,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s multimodal model with strong reasoning capabilities',
    capabilities: ['Text Generation', 'Multimodal Understanding', 'Research'],
    costPer1kTokens: 0.0025,
    maxTokens: 8192,
    contextWindow: 32000,
    inputCostPer1kTokens: 0.00125,
    outputCostPer1kTokens: 0.00375,
    logoUrl: '/models/google-logo.svg',
    strengths: ['Multimodal', 'Factual Accuracy', 'Cost-Effective'],
    weaknesses: ['Creativity', 'Instruction Following'],
    elo: 1650,
    popularity: 85,
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Meta\'s latest open-source large language model',
    capabilities: ['Text Generation', 'Code Generation', 'Open-Source'],
    costPer1kTokens: 0.001,
    maxTokens: 4096,
    contextWindow: 8000,
    inputCostPer1kTokens: 0.0005,
    outputCostPer1kTokens: 0.0015,
    logoUrl: '/models/meta-logo.svg',
    strengths: ['Open-Source', 'Cost-Effective', 'Community Support'],
    weaknesses: ['Context Length', 'Specialized Knowledge'],
    elo: 1600,
    popularity: 75,
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral',
    description: 'Mistral\'s mixture-of-experts model with strong capabilities',
    capabilities: ['Text Generation', 'Code Generation', 'Efficient Inference'],
    costPer1kTokens: 0.0008,
    maxTokens: 4096,
    contextWindow: 32000,
    inputCostPer1kTokens: 0.0004,
    outputCostPer1kTokens: 0.0012,
    logoUrl: '/models/mistral-logo.svg',
    strengths: ['Efficiency', 'Long Context', 'Code Generation'],
    weaknesses: ['Advanced Reasoning'],
    elo: 1550,
    popularity: 70,
  },
  {
    id: 'command-r',
    name: 'Command R',
    provider: 'Cohere',
    description: 'Cohere\'s command model optimized for search and retrieval',
    capabilities: ['Text Generation', 'Search Optimization', 'Enterprise Applications'],
    costPer1kTokens: 0.015,
    maxTokens: 4096,
    contextWindow: 128000,
    inputCostPer1kTokens: 0.0075,
    outputCostPer1kTokens: 0.0225,
    logoUrl: '/models/cohere-logo.svg',
    strengths: ['Search', 'Retrieval', 'Enterprise Integration'],
    weaknesses: ['Creative Writing'],
    elo: 1500,
    popularity: 65,
  },
];

export const getAvailableModels = async (): Promise<ModelType[]> => {
  // In a real application, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(models);
    }, 500);
  });
};

export const getModelById = async (modelId: string): Promise<ModelType | undefined> => {
  // In a real application, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(models.find((model) => model.id === modelId));
    }, 200);
  });
};

export const getProviderModels = async (provider: string): Promise<ModelType[]> => {
  // In a real application, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(models.filter((model) => model.provider === provider));
    }, 300);
  });
};

export const calculateTokenCost = (
  inputTokens: number,
  outputTokens: number,
  model: ModelType
): number => {
  const inputCost = (inputTokens / 1000) * model.inputCostPer1kTokens;
  const outputCost = (outputTokens / 1000) * model.outputCostPer1kTokens;
  return inputCost + outputCost;
};

export const estimateTokenCount = (text: string): number => {
  // Simple estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
};