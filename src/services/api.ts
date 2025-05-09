import { Message, ModelType } from '../types';
import { estimateTokenCount, calculateTokenCost } from './models';

// Simulated API response with different response times for different models
export const generateResponse = async (
  prompt: string,
  model: ModelType
): Promise<{
  content: string;
  latency: number;
  tokenCount: number;
  cost: number;
}> => {
  // This is a simulation - in a real app, this would call the actual AI provider APIs
  const startTime = Date.now();
  
  // Simulate different response times and qualities based on model
  const baseDelay = 500 + Math.random() * 1000;
  const modelSpecificDelay = getModelSpecificDelay(model);
  const totalDelay = baseDelay + modelSpecificDelay;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = generateSimulatedResponse(prompt, model);
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      // Calculate token usage and cost
      const promptTokens = estimateTokenCount(prompt);
      const responseTokens = estimateTokenCount(content);
      const cost = calculateTokenCost(promptTokens, responseTokens, model);
      
      resolve({
        content,
        latency,
        tokenCount: promptTokens + responseTokens,
        cost,
      });
    }, totalDelay);
  });
};

// Generate multiple responses from different models
export const generateMultipleResponses = async (
  prompt: string,
  models: ModelType[]
): Promise<
  {
    modelId: string;
    content: string;
    latency: number;
    tokenCount: number;
    cost: number;
  }[]
> => {
  const responsePromises = models.map(async (model) => {
    const response = await generateResponse(prompt, model);
    return {
      modelId: model.id,
      ...response,
    };
  });
  
  return Promise.all(responsePromises);
};

// Helper function to simulate different response times for different models
const getModelSpecificDelay = (model: ModelType): number => {
  switch (model.provider) {
    case 'OpenAI':
      return 800 + Math.random() * 500;
    case 'Anthropic':
      return 1200 + Math.random() * 800;
    case 'Google':
      return 600 + Math.random() * 400;
    case 'Cohere':
      return 700 + Math.random() * 600;
    case 'Meta':
      return 500 + Math.random() * 300;
    case 'Mistral':
      return 400 + Math.random() * 300;
    default:
      return 1000 + Math.random() * 500;
  }
};

// Generate realistic-looking simulated responses
const generateSimulatedResponse = (prompt: string, model: ModelType): string => {
  // These are template responses that would be replaced with actual API calls
  const templates = [
    `As ${model.name} by ${model.provider}, I can help with that. ${prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt} is an interesting question. Here's my detailed analysis based on my knowledge and capabilities...`,
    
    `I'm ${model.name}, and I've processed your query about "${prompt.length > 15 ? prompt.substring(0, 15) + '...' : prompt}". Based on my training data and algorithms, I can provide the following insights...`,
    
    `Thank you for your question about ${prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt}. As ${model.provider}'s ${model.name} model, I've analyzed this and can offer the following perspective...`
  ];
  
  // Select a random template
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Add some model-specific "flavor" to responses
  let response = selectedTemplate;
  
  switch (model.provider) {
    case 'OpenAI':
      response += ' My training includes data up to 2023, and I aim to be helpful, harmless, and honest in my responses.';
      break;
    case 'Anthropic':
      response += ' I strive to be helpful, harmless, and honest while maintaining constitutional AI principles in my responses.';
      break;
    case 'Google':
      response += ' As a Google AI model, I leverage Google\'s research to provide factual and helpful information.';
      break;
    default:
      response += ' I aim to provide accurate and helpful information based on my training.';
  }
  
  // Add some length variance based on model capabilities
  const paragraphs = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < paragraphs; i++) {
    response += '\n\nFurthermore, analyzing this topic requires considering multiple perspectives. ' +
      'There are various factors to take into account including contextual relevance, historical precedents, ' +
      'and potential future implications.';
  }
  
  return response;
};

// Simulate updating model Elo rating based on battle results
export const updateModelEloRating = async (
  winningModelId: string,
  losingModelId: string,
  isDraw: boolean = false
): Promise<Record<string, number>> => {
  // This would be a server-side calculation in a real app
  // Simple Elo calculation for demonstration
  const kFactor = 32; // Sensitivity of rating changes
  
  // Get current ratings (would come from backend in real app)
  const currentRatings: Record<string, number> = {
    'gpt-4': 1800,
    'claude-3-opus': 1780,
    'gemini-pro': 1650,
    'llama-3-70b': 1600,
    'mixtral-8x7b': 1550,
    'command-r': 1500,
  };
  
  const ratingA = currentRatings[winningModelId] || 1500;
  const ratingB = currentRatings[losingModelId] || 1500;
  
  // Calculate expected scores
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
  
  // Calculate new ratings
  let newRatingA, newRatingB;
  
  if (isDraw) {
    newRatingA = ratingA + kFactor * (0.5 - expectedA);
    newRatingB = ratingB + kFactor * (0.5 - expectedB);
  } else {
    newRatingA = ratingA + kFactor * (1 - expectedA);
    newRatingB = ratingB + kFactor * (0 - expectedB);
  }
  
  // Update ratings
  currentRatings[winningModelId] = Math.round(newRatingA);
  currentRatings[losingModelId] = Math.round(newRatingB);
  
  return currentRatings;
};