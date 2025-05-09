import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MoreHorizontal, Mic, Copy, Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { generateMultipleResponses } from '../services/api';
import { ModelType, Message } from '../types';

const Chat: React.FC = () => {
  const { 
    selectedModels, 
    availableModels, 
    setSelectedModels, 
    currentConversation, 
    createConversation, 
    addMessage 
  } = useAppContext();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentConversation) {
      createConversation();
    }
  }, [currentConversation, createConversation]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || !currentConversation) return;
    
    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      // Generate responses from all selected models
      const responses = await generateMultipleResponses(
        input,
        selectedModels.length > 0 ? selectedModels : availableModels.slice(0, 2)
      );
      
      // Create assistant message with all model responses
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '', // The primary content is empty as we store responses per model
        timestamp: new Date(),
        modelResponses: responses.map((response) => ({
          modelId: response.modelId,
          content: response.content,
          latency: response.latency,
          tokenCount: response.tokenCount,
          cost: response.cost,
        })),
      };
      
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error generating responses:', error);
      // Handle error case
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMessages = () => {
    if (!currentConversation) return null;
    
    return currentConversation.messages.map((message) => {
      if (message.role === 'user') {
        return (
          <div key={message.id} className="mb-6">
            <div className="flex justify-end">
              <div className="bg-primary-600/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                <p className="text-white">{message.content}</p>
              </div>
            </div>
          </div>
        );
      } else if (message.role === 'assistant' && message.modelResponses) {
        return (
          <div key={message.id} className="mb-6 space-y-4">
            {message.modelResponses.map((response, index) => {
              const model = availableModels.find((m) => m.id === response.modelId);
              
              return (
                <motion.div
                  key={`${message.id}-${response.modelId}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                  className="flex"
                >
                  <div className="glass-card rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 bg-dark-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">{model?.provider.substring(0, 2)}</span>
                      </div>
                      <span className="text-sm font-medium text-primary-400">
                        {model?.name || 'AI Assistant'}
                      </span>
                      <div className="ml-auto flex space-x-1">
                        <button 
                          className="p-1 text-gray-400 hover:text-white rounded"
                          aria-label="Copy response"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-white rounded"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-gray-200 whitespace-pre-wrap">
                      {response.content}
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{response.latency}ms</span>
                        <span>{response.tokenCount} tokens</span>
                        <span>${response.cost.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      }
      
      return null;
    });
  };
  
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Model Selection */}
      <div className="p-4 border-b border-dark-300">
        <div className="flex flex-wrap gap-2">
          {availableModels.slice(0, 4).map((model) => (
            <button
              key={model.id}
              onClick={() => {
                const isSelected = selectedModels.some((m) => m.id === model.id);
                if (isSelected) {
                  setSelectedModels(selectedModels.filter((m) => m.id !== model.id));
                } else {
                  setSelectedModels([...selectedModels, model]);
                }
              }}
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
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Sparkles className="h-12 w-12 text-primary-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start a new conversation</h2>
            <p className="text-gray-400 max-w-md">
              Chat with multiple AI models simultaneously and compare their responses in real-time.
            </p>
          </div>
        ) : (
          renderMessages()
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-dark-300">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 glass-card rounded-xl min-h-[50px] focus-within:gradient-border overflow-hidden">
            <div className="flex items-end">
              <textarea
                className="w-full bg-transparent border-0 focus:ring-0 resize-none p-3 text-white placeholder-gray-500"
                placeholder="Message multiple AI models at once..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                style={{ minHeight: '50px' }}
              />
              <div className="flex items-center p-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-white rounded-full"
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            className="rounded-full h-12 w-12 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={18} />
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-center text-gray-500">
          {selectedModels.length > 0
            ? `Chatting with ${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''}`
            : 'Select models above or we will use the default models'}
        </div>
      </div>
    </div>
  );
};

export default Chat;