import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ThumbsUp, Send, RefreshCw, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import ModelCard from '../components/ui/ModelCard';
import { ModelBattle, ModelType } from '../types';
import { generateMultipleResponses, updateModelEloRating } from '../services/api';

const Battle: React.FC = () => {
  const { availableModels, modelRankings, updateModelRankings } = useAppContext();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([]);
  const [currentBattle, setCurrentBattle] = useState<ModelBattle | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pastBattles, setPastBattles] = useState<ModelBattle[]>([]);
  
  // Set default selected models on initial load
  useEffect(() => {
    if (availableModels.length >= 2 && selectedModels.length === 0) {
      setSelectedModels([availableModels[0], availableModels[1]]);
    }
  }, [availableModels, selectedModels]);
  
  const handleSelectModel = (model: ModelType) => {
    // Toggle selection
    if (selectedModels.some((m) => m.id === model.id)) {
      setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
    } else {
      // Limit to 2 models for battle
      if (selectedModels.length < 2) {
        setSelectedModels([...selectedModels, model]);
      } else {
        // Replace the first model if already have 2
        setSelectedModels([selectedModels[1], model]);
      }
    }
  };
  
  const startBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isLoading || selectedModels.length !== 2) return;
    
    setIsLoading(true);
    setHasVoted(false);
    
    try {
      // Generate responses for the selected models
      const responses = await generateMultipleResponses(prompt, selectedModels);
      
      // Create a new battle
      const newBattle: ModelBattle = {
        id: `battle-${Date.now()}`,
        prompt,
        models: selectedModels,
        responses: responses.map((response) => ({
          modelId: response.modelId,
          content: response.content,
          votes: 0,
        })),
        createdAt: new Date(),
      };
      
      setCurrentBattle(newBattle);
      setPrompt('');
      
      // Add to past battles
      setPastBattles((prev) => [newBattle, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error starting battle:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVote = async (modelId: string) => {
    if (!currentBattle || hasVoted) return;
    
    // Update votes
    const updatedBattle = {
      ...currentBattle,
      responses: currentBattle.responses.map((response) => ({
        ...response,
        votes: response.modelId === modelId ? response.votes + 1 : response.votes,
      })),
    };
    
    setCurrentBattle(updatedBattle);
    setHasVoted(true);
    
    // Find the other model
    const otherModelId = currentBattle.models.find((m) => m.id !== modelId)?.id || '';
    
    // Update Elo ratings
    if (otherModelId) {
      const updatedRatings = await updateModelEloRating(modelId, otherModelId);
      
      // Update global rankings
      Object.entries(updatedRatings).forEach(([id, rating]) => {
        updateModelRankings(id, rating);
      });
      
      // Update past battles
      setPastBattles((prev) =>
        prev.map((battle) => (battle.id === updatedBattle.id ? updatedBattle : battle))
      );
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-bold">AI Battle Arena</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Current Battle */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create a New Battle</h2>
            
            <form onSubmit={startBattle}>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-1">
                  Challenge Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="Enter a challenging prompt to test the models..."
                  className="w-full bg-dark-300 border-dark-200 rounded-md text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelectModel(model)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                      selectedModels.some((m) => m.id === model.id)
                        ? 'bg-primary-600/30 text-primary-400 border border-primary-600'
                        : 'bg-dark-300 text-gray-400 border border-dark-300'
                    }`}
                  >
                    <span className="text-xs font-bold mr-1">{model.provider.substring(0, 2)}</span>
                    {model.name}
                  </button>
                ))}
              </div>
              
              <Button
                type="submit"
                disabled={!prompt.trim() || selectedModels.length !== 2 || isLoading}
                icon={isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
              >
                {isLoading ? 'Battling...' : 'Start Battle'}
              </Button>
            </form>
          </div>
          
          {/* Battle Results */}
          {currentBattle && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2">Battle Results</h2>
              <p className="text-sm text-gray-400 mb-6">
                Vote for the best response to update model rankings
              </p>
              
              <div className="mb-4 bg-dark-300 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Prompt:</h3>
                <p className="text-white">{currentBattle.prompt}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentBattle.responses.map((response, index) => {
                  const model = availableModels.find((m) => m.id === response.modelId);
                  
                  return (
                    <motion.div
                      key={response.modelId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.2 }}
                      className={`glass-card rounded-xl p-4 relative ${
                        hasVoted && response.votes > 0 ? 'gradient-border' : ''
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 bg-dark-300 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-bold">{model?.provider.substring(0, 2)}</span>
                        </div>
                        <span className="font-medium text-primary-400">{model?.name}</span>
                        
                        {hasVoted && response.votes > 0 && (
                          <div className="ml-auto px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center">
                            <Trophy size={12} className="mr-1" />
                            Winner
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-dark-300 rounded-lg p-3 mb-3 max-h-60 overflow-y-auto">
                        <p className="text-gray-200 whitespace-pre-wrap">{response.content}</p>
                      </div>
                      
                      <Button
                        onClick={() => handleVote(response.modelId)}
                        disabled={hasVoted}
                        variant={hasVoted ? 'ghost' : 'outline'}
                        size="sm"
                        fullWidth
                        icon={<ThumbsUp size={16} />}
                      >
                        {hasVoted ? (response.votes > 0 ? 'Voted' : 'Not Selected') : 'Vote for this response'}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div>
          {/* Rankings */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Model Rankings</h2>
            <p className="text-sm text-gray-400 mb-4">
              Based on {pastBattles.length} battle{pastBattles.length !== 1 ? 's' : ''}
            </p>
            
            <div className="space-y-3">
              {availableModels
                .sort((a, b) => (modelRankings[b.id] || 1500) - (modelRankings[a.id] || 1500))
                .slice(0, 5)
                .map((model, index) => (
                  <div
                    key={model.id}
                    className="flex items-center p-2 rounded-lg bg-dark-300"
                  >
                    <div className="w-6 text-center font-mono text-sm text-gray-400 mr-2">
                      #{index + 1}
                    </div>
                    <div className="h-6 w-6 bg-dark-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">{model.provider.substring(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium flex-1">{model.name}</span>
                    <span className="text-primary-400 font-mono font-medium">
                      {modelRankings[model.id] || 1500}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Past Battles */}
          {pastBattles.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Battle History</h2>
              
              <div className="space-y-3">
                {pastBattles.map((battle) => {
                  const winningResponse = battle.responses.reduce(
                    (prev, current) => (prev.votes > current.votes ? prev : current),
                    battle.responses[0]
                  );
                  const winningModel = availableModels.find((m) => m.id === winningResponse.modelId);
                  
                  return (
                    <div
                      key={battle.id}
                      className="p-3 rounded-lg bg-dark-300 cursor-pointer hover:bg-dark-200 transition-colors"
                      onClick={() => setCurrentBattle(battle)}
                    >
                      <div className="text-sm mb-1 line-clamp-1">{battle.prompt}</div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(battle.createdAt).toLocaleString()}
                        </div>
                        <div className="ml-auto flex items-center text-yellow-400">
                          <Trophy size={12} className="mr-1" />
                          {winningModel?.name || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Battle;