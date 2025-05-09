import React from 'react';
import { Check, AlertCircle, Award, Zap } from 'lucide-react';
import { ModelType } from '../../types';
import { motion } from 'framer-motion';

interface ModelCardProps {
  model: ModelType;
  isSelected?: boolean;
  onSelect?: () => void;
  showDetails?: boolean;
  ranking?: number;
  className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected = false,
  onSelect,
  showDetails = false,
  ranking,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl cursor-pointer overflow-hidden ${
        isSelected ? 'gradient-border animate-pulse-glow' : ''
      } ${className}`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {model.logoUrl && (
              <div className="h-10 w-10 bg-dark-300 rounded-full flex items-center justify-center">
                {/* This would be an actual logo in production */}
                <span className="text-xs font-bold">{model.provider.substring(0, 2)}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">{model.name}</h3>
              <p className="text-xs text-gray-400">{model.provider}</p>
            </div>
          </div>
          {model.badge && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-600/30 text-primary-400">
              {model.badge}
            </span>
          )}
        </div>

        {showDetails && (
          <div className="mt-4">
            <p className="text-sm text-gray-300 line-clamp-2 h-10">{model.description}</p>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Zap size={12} className="mr-1 text-yellow-500" />
                <span className="text-gray-400">
                  ${model.costPer1kTokens.toFixed(4)}/1k tokens
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400">
                  {model.contextWindow.toLocaleString()} ctx
                </span>
              </div>
            </div>
            
            {model.strengths && model.strengths.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Strengths:</p>
                <div className="flex flex-wrap gap-1">
                  {model.strengths.slice(0, 3).map((strength, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-success-700/20 text-success-500">
                      <Check size={10} className="mr-1" /> {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {model.weaknesses && model.weaknesses.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Weaknesses:</p>
                <div className="flex flex-wrap gap-1">
                  {model.weaknesses.slice(0, 2).map((weakness, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-error-700/20 text-error-500">
                      <AlertCircle size={10} className="mr-1" /> {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {ranking && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Elo Rating:</span>
                <span className="flex items-center text-sm font-medium text-primary-400">
                  <Award size={14} className="mr-1" /> {model.elo || 1500}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModelCard;