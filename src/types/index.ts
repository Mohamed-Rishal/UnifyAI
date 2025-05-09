export type ModelProvider = 
  | 'OpenAI' 
  | 'Anthropic' 
  | 'Google' 
  | 'Cohere'
  | 'Meta' 
  | 'Mistral' 
  | 'Hugging Face'
  | 'Azure OpenAI';

export type ModelType = {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  capabilities: string[];
  costPer1kTokens: number;
  maxTokens: number;
  contextWindow: number;
  inputCostPer1kTokens: number;
  outputCostPer1kTokens: number;
  logoUrl: string;
  badge?: string;
  strengths?: string[];
  weaknesses?: string[];
  elo?: number;
  popularity?: number;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: ModelType;
  modelResponses?: {
    modelId: string;
    content: string;
    latency: number;
    tokenCount: number;
    cost: number;
  }[];
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  models: ModelType[];
};

export type ExportFormat = 'pdf' | 'markdown' | 'json' | 'text';

export type ModelBattle = {
  id: string;
  prompt: string;
  models: ModelType[];
  responses: {
    modelId: string;
    content: string;
    votes: number;
  }[];
  createdAt: Date;
};

export type ModelComparisonResult = {
  prompt: string;
  results: {
    modelId: string;
    response: string;
    metrics: {
      latency: number;
      tokenCount: number;
      cost: number;
      quality?: number;
    };
  }[];
  timestamp: Date;
};

export type BattleVote = {
  battleId: string;
  modelId: string;
  userId: string;
  timestamp: Date;
};

export type UserSettings = {
  theme: 'dark' | 'light';
  preferredModels: string[];
  costLimit?: number;
  apiKeys?: Record<ModelProvider, string>;
};