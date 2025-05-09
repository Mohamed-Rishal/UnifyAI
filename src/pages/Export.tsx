import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileJson, FileImage, HardDrive, Check, ExternalLink } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { ExportFormat, Conversation } from '../types';

const Export: React.FC = () => {
  const { conversations } = useAppContext();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = () => {
    if (!selectedConversation) return;
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Format options for export
  const exportFormats: Array<{ id: ExportFormat; name: string; description: string; icon: React.ReactNode }> = [
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Portable text format with formatting',
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'Structured data for developers',
      icon: <FileJson className="h-6 w-6" />,
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Professional document format',
      icon: <FileImage className="h-6 w-6" />,
    },
    {
      id: 'text',
      name: 'Plain Text',
      description: 'Simple, universal format',
      icon: <FileText className="h-6 w-6" />,
    },
  ];
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-8">
        <Download className="h-8 w-8 text-primary-400 mr-3" />
        <h1 className="text-3xl font-bold">Export Conversations</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversation selection */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Select Conversation</h2>
          
          {conversations.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-3 rounded-lg text-left ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-600/30 border border-primary-600'
                      : 'bg-dark-300 border border-dark-300 hover:bg-dark-200'
                  }`}
                >
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-gray-400" />
                    <div className="truncate">{conversation.title}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.createdAt).toLocaleDateString()} • {conversation.messages.length} messages
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-dark-300 rounded-lg">
              <p className="text-gray-400">No conversations yet</p>
              <p className="text-sm text-gray-500 mt-2">Start chatting to create conversations</p>
            </div>
          )}
        </div>
        
        {/* Format selection */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Select Format</h2>
          
          <div className="space-y-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`w-full p-3 rounded-lg text-left flex items-center ${
                  selectedFormat === format.id
                    ? 'bg-primary-600/30 border border-primary-600'
                    : 'bg-dark-300 border border-dark-300 hover:bg-dark-200'
                }`}
              >
                <div className={`mr-3 ${selectedFormat === format.id ? 'text-primary-400' : 'text-gray-400'}`}>
                  {format.icon}
                </div>
                <div>
                  <div className="font-medium">{format.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{format.description}</div>
                </div>
                {selectedFormat === format.id && (
                  <div className="ml-auto text-primary-400">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Preview and export */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Preview & Export</h2>
          
          {selectedConversation ? (
            <>
              <div className="bg-dark-300 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto">
                <h3 className="text-sm font-medium mb-2">
                  {selectedConversation.title}
                </h3>
                <div className="text-xs text-gray-400 space-y-2">
                  {selectedConversation.messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="p-2 rounded bg-dark-400">
                      <div className="text-gray-500 mb-1">{message.role}:</div>
                      <div className="text-gray-300 line-clamp-2">{message.content}</div>
                    </div>
                  ))}
                  {selectedConversation.messages.length > 3 && (
                    <div className="text-center text-gray-500 py-1">
                      + {selectedConversation.messages.length - 3} more messages
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Format:</span>
                  <span className="text-primary-400">{selectedFormat.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Messages:</span>
                  <span>{selectedConversation.messages.length}</span>
                </div>
              </div>
              
              <Button
                onClick={handleExport}
                disabled={isExporting}
                fullWidth
                variant="primary"
                icon={isExporting ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : <Download size={16} />}
              >
                {isExporting ? 'Exporting...' : 'Export Conversation'}
              </Button>
              
              {exportSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 rounded bg-success-700/20 text-success-400 text-sm flex items-center justify-center"
                >
                  <Check size={14} className="mr-1" />
                  Export successful
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center p-6 bg-dark-300 rounded-lg">
              <p className="text-gray-400">No conversation selected</p>
              <p className="text-sm text-gray-500 mt-2">Select a conversation to preview</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Export documentation */}
      <div className="mt-8 glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Export Documentation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Export Formats</h3>
            <ul className="space-y-3">
              <li className="p-3 bg-dark-300 rounded-lg">
                <div className="font-medium mb-1">Markdown (.md)</div>
                <p className="text-sm text-gray-400">
                  Perfect for documentation and sharing on platforms like GitHub or notion.
                </p>
              </li>
              <li className="p-3 bg-dark-300 rounded-lg">
                <div className="font-medium mb-1">JSON (.json)</div>
                <p className="text-sm text-gray-400">
                  Complete conversation data with metadata, ideal for developers.
                </p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Tips</h3>
            <ul className="space-y-3">
              <li className="p-3 bg-dark-300 rounded-lg">
                <div className="font-medium mb-1">Batch Export</div>
                <p className="text-sm text-gray-400">
                  Export multiple conversations at once by using the API.
                </p>
                <a href="#" className="text-xs flex items-center mt-2 text-primary-400 hover:text-primary-300">
                  <ExternalLink size={12} className="mr-1" />
                  View API documentation
                </a>
              </li>
              <li className="p-3 bg-dark-300 rounded-lg">
                <div className="font-medium mb-1">Data Privacy</div>
                <p className="text-sm text-gray-400">
                  Exported files are generated locally in your browser for privacy.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;