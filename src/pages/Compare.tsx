import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Send, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import ModelCard from '../components/ui/ModelCard';
import { ModelType, ModelComparisonResult } from '../types';
import { generateMultipleResponses } from '../services/api';

// Basic chart component
const MetricBar: React.FC<{ 
  value: number; 
  maxValue: number; 
  label: string;
  color: string;
  suffix?: string;
}> = ({ value, maxValue, label, color, suffix = '' }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={`font-mono ${color}`}>
          {value.toLocaleString()}{suffix}
        </span>
      </div>
      <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
};

const Compare: React.FC = () => {
  const { availableModels } = useAppContext();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ModelComparisonResult | null>(null);
  
  // Set default selected models
  React.useEffect(() => {
    if (availableModels.length > 0 && selectedModels.length === 0) {
      setSelectedModels(availableModels.slice(0, 3));
    }
  }, [availableModels, selectedModels]);
  
  const handleSelectModel = (model: ModelType) => {
    if (selectedModels.some((m) => m.id === model.id)) {
      setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };
  
  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isLoading || selectedModels.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Generate responses for the selected models
      const responses = await generateMultipleResponses(prompt, selectedModels);
      
      // Create comparison result
      const result: ModelComparisonResult = {
        prompt,
        results: responses.map((response) => ({
          modelId: response.modelId,
          response: response.content,
          metrics: {
            latency: response.latency,
            tokenCount: response.tokenCount,
            cost: response.cost,
            quality: Math.random() * 100, // This would be a real quality metric in production
          },
        })),
        timestamp: new Date(),
      };
      
      setComparisonResult(result);
      setPrompt('');
    } catch (error) {
      console.error('Error comparing models:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <BarChart2 className="h-8 w-8 text-secondary-400 mr-3" />
        <h1 className="text-3xl font-bold">Compare AI Models</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          {/* Model Selection */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Models to Compare</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className={`p-3 rounded-lg text-left flex items-center ${
                    selectedModels.some((m) => m.id === model.id)
                      ? 'bg-primary-600/20 border border-primary-600'
                      : 'bg-dark-300 border border-dark-300'
                  }`}
                >
                  <div className="h-8 w-8 bg-dark-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">{model.provider.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {model.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {model.provider}
                    </div>
                  </div>
                  <div className="ml-2 text-xs px-1.5 py-0.5 rounded bg-dark-200 text-gray-400">
                    ${model.costPer1kTokens.toFixed(4)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Comparison Form */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Comparison Prompt</h2>
            
            <form onSubmit={handleCompare}>
              <div className="mb-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Enter a prompt to compare across models..."
                  className="w-full bg-dark-300 border-dark-200 rounded-md text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <Button
                type="submit"
                disabled={!prompt.trim() || selectedModels.length === 0 || isLoading}
                icon={isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
                fullWidth
              >
                {isLoading ? 'Comparing...' : 'Compare Models'}
              </Button>
              
              <div className="mt-3 text-xs text-center text-gray-400">
                {selectedModels.length === 0
                  ? 'Select at least one model'
                  : `Comparing ${selectedModels.length} model${selectedModels.length !== 1 ? 's' : ''}`}
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {/* Comparison Results */}
          {comparisonResult ? (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Comparison Results</h2>
              
              <div className="mb-6 bg-dark-300 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Prompt:</h3>
                <p className="text-white">{comparisonResult.prompt}</p>
              </div>
              
              {/* Performance metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Latency', 'Tokens', 'Cost'].map((metric, index) => (
                    <div key={metric} className="glass-card p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-3">{metric}</h4>
                      
                      {comparisonResult.results.map((result) => {
                        const model = availableModels.find((m) => m.id === result.modelId);
                        const maxLatency = Math.max(...comparisonResult.results.map((r) => r.metrics.latency));
                        const maxTokens = Math.max(...comparisonResult.results.map((r) => r.metrics.tokenCount));
                        const maxCost = Math.max(...comparisonResult.results.map((r) => r.metrics.cost));
                        
                        return (
                          <div key={result.modelId} className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">{model?.name}</div>
                            {metric === 'Latency' && (
                              <MetricBar
                                value={result.metrics.latency}
                                maxValue={maxLatency}
                                label=""
                                color="text-secondary-400"
                                suffix="ms"
                              />
                            )}
                            {metric === 'Tokens' && (
                              <MetricBar
                                value={result.metrics.tokenCount}
                                maxValue={maxTokens}
                                label=""
                                color="text-primary-400"
                              />
                            )}
                            {metric === 'Cost' && (
                              <MetricBar
                                value={result.metrics.cost}
                                maxValue={maxCost}
                                label=""
                                color="text-green-400"
                                suffix="$"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Response Comparison */}
              <div>
                <h3 className="text-lg font-medium mb-4">Response Comparison</h3>
                
                <div className="space-y-4">
                  {comparisonResult.results.map((result) => {
                    const model = availableModels.find((m) => m.id === result.modelId);
                    
                    return (
                      <motion.div
                        key={result.modelId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card rounded-lg p-4"
                      >
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 bg-dark-300 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">{model?.provider.substring(0, 2)}</span>
                          </div>
                          <span className="font-medium text-primary-400">{model?.name}</span>
                          
                          <div className="ml-auto flex space-x-3 text-xs">
                            <div className="flex items-center text-secondary-400">
                              <Clock size={12} className="mr-1" />
                              {result.metrics.latency}ms
                            </div>
                            <div className="flex items-center text-green-400">
                              ${result.metrics.cost.toFixed(4)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-dark-300 rounded-lg p-3 max-h-60 overflow-y-auto">
                          <p className="text-gray-200 whitespace-pre-wrap">{result.response}</p>
                        </div>
                        
                        <div className="mt-3 flex justify-between">
                          <div className="flex items-center text-xs text-gray-400">
                            {result.metrics.tokenCount} tokens
                          </div>
                          
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-success-700/20 text-success-500">
                              <CheckCircle size={12} className="mr-1" /> Factual
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-error-700/20 text-error-500">
                              <AlertCircle size={12} className="mr-1" /> Slow
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 h-full flex flex-col items-center justify-center text-center">
              <BarChart2 className="h-16 w-16 text-gray-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Compare AI Models</h2>
              <p className="text-gray-400 max-w-md">
                Select models and enter a prompt to see a side-by-side comparison of
                performance, response quality, and cost.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;