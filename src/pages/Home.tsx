import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, BarChart2, Trophy, Mic, Zap, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import ModelCard from '../components/ui/ModelCard';
import { useAppContext } from '../contexts/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { availableModels } = useAppContext();
  
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary-400" />,
      title: 'Unified Chat Interface',
      description: 'Chat with multiple AI models simultaneously and compare their responses in real-time.',
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-secondary-400" />,
      title: 'Performance Metrics',
      description: 'Compare response quality, speed, and cost across different models and providers.',
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: 'AI Battles',
      description: 'Vote on the best responses in head-to-head battles and see Elo ratings evolve.',
    },
    {
      icon: <Mic className="h-6 w-6 text-accent-400" />,
      title: 'Voice Interface',
      description: 'Speak to AI models directly with our browser-based voice recognition system.',
    },
    {
      icon: <Zap className="h-6 w-6 text-green-500" />,
      title: 'Cost Optimization',
      description: 'Save up to 65% on API costs with intelligent request routing and caching.',
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      title: 'Multi-Provider Support',
      description: 'Access models from OpenAI, Anthropic, Google, Meta, Mistral, and more.',
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span>Unify </span>
            <span className="gradient-text">Every AI</span>
            <span> in One Platform</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Compare, battle, and optimize AI models in real-time with UnifyAI's unified gateway to the world's most powerful AI systems.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/chat')}
              icon={<MessageSquare size={20} />}
            >
              Start Chatting
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/compare')}
              icon={<BarChart2 size={20} />}
            >
              Compare Models
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Model Showcase */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Access 12+ Leading AI Models</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            One API, unlimited possibilities. Connect to the world's most powerful AI models through a single, unified interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {availableModels.slice(0, 3).map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              showDetails={true}
              className="card-hover"
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/compare')}
          >
            View All Models
          </Button>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI with our comprehensive suite of features designed for developers and enterprises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl card-hover"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm flex-1">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Unify Your AI Experience?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and enterprises who have streamlined their AI workflows and reduced costs with UnifyAI.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/chat')}
            className="px-8"
          >
            Get Started For Free
          </Button>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>
      </section>
    </div>
  );
};

export default Home;