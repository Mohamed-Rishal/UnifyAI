import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Square, Wand, Volume2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { generateResponse } from '../services/api';

const Voice: React.FC = () => {
  const { selectedModels, availableModels } = useAppContext();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // These would be real refs in a full implementation
  const mediaRecorderRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate starting recording
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    
    // In a real implementation, we would use the Web Audio API
    console.log('Recording started...');
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Simulate transcription (in real app, this would be done with WebAssembly Whisper)
    setTimeout(() => {
      setTranscription('What are the key differences between traditional machine learning and deep learning approaches?');
    }, 1000);
    
    console.log('Recording stopped...');
  };
  
  const generateAIResponse = async () => {
    if (!transcription) return;
    
    setIsGenerating(true);
    
    try {
      // Get the first available model
      const model = selectedModels.length > 0 ? selectedModels[0] : availableModels[0];
      
      const result = await generateResponse(transcription, model);
      setResponse(result.content);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const playResponse = () => {
    setIsPlaying(true);
    
    // Simulate text-to-speech (in real app, this would use Web Speech API)
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
    
    console.log('Playing response...');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Voice Interface</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Speak to AI models using our optimized voice recognition system with just 200ms latency.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              scale: isRecording ? [1, 1.1, 1] : 1,
              transition: {
                repeat: isRecording ? Infinity : 0,
                duration: 1.5,
              },
            }}
            className={`h-24 w-24 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-error-600' : 'bg-dark-300'
            }`}
          >
            <button
              onClick={toggleRecording}
              className={`h-20 w-20 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-error-700 text-white' : 'bg-primary-600 text-white'
              }`}
            >
              {isRecording ? (
                <MicOff size={32} />
              ) : (
                <Mic size={32} />
              )}
            </button>
          </motion.div>
          
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center text-error-500"
            >
              <span className="h-2 w-2 rounded-full bg-error-500 mr-2 animate-pulse"></span>
              <span>Recording... {formatTime(recordingTime)}</span>
            </motion.div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {isRecording
                ? 'Click the microphone button again when you\'re done speaking'
                : 'Click the microphone button and speak your query'}
            </p>
            <Button
              onClick={toggleRecording}
              variant={isRecording ? 'danger' : 'primary'}
              size="lg"
              className="mt-2"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>
        </div>
      </div>
      
      {transcription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-medium mb-3">Transcription</h2>
          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <p className="text-white">{transcription}</p>
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={() => setTranscription('')}
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
            <Button
              onClick={generateAIResponse}
              disabled={isGenerating}
              icon={isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : <Wand size={16} />}
            >
              {isGenerating ? 'Generating...' : 'Generate Response'}
            </Button>
          </div>
        </motion.div>
      )}
      
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-3">AI Response</h2>
          <div className="bg-dark-300 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
            <p className="text-white whitespace-pre-wrap">{response}</p>
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={16} />}
            >
              New Conversation
            </Button>
            <Button
              onClick={playResponse}
              disabled={isPlaying}
              variant="primary"
              icon={isPlaying ? <Square size={16} /> : <Play size={16} />}
            >
              <div className="flex items-center">
                {isPlaying ? 'Playing...' : 'Play Response'}
                {isPlaying && (
                  <motion.div 
                    animate={{ 
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    <Volume2 size={16} />
                  </motion.div>
                )}
              </div>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Voice;