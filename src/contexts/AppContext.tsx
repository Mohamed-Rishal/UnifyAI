import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { ModelType, Message, Conversation, ModelProvider } from '../types';
import { getAvailableModels } from '../services/models';
import toast from 'react-hot-toast';

type AppContextType = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedModels: ModelType[];
  setSelectedModels: (models: ModelType[]) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: () => void;
  addMessage: (message: Message) => void;
  isLoading: boolean;
  costSaved: number;
  availableModels: ModelType[];
  modelRankings: Record<string, number>;
  updateModelRankings: (modelId: string, newRating: number) => void;
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AppContext = createContext<AppContextType | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [costSaved, setCostSaved] = useState(0);
  const [availableModels, setAvailableModels] = useState<ModelType[]>([]);
  const [modelRankings, setModelRankings] = useState<Record<string, number>>({});
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await getAvailableModels();
        setAvailableModels(models);
        
        const initialRankings: Record<string, number> = {};
        models.forEach((model) => {
          initialRankings[model.id] = 1500;
        });
        setModelRankings(initialRankings);
        
        setSelectedModels([models[0], models[1]]);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        toast.error('Failed to load AI models');
      }
    };
    
    fetchModels();
    
    const costInterval = setInterval(() => {
      setCostSaved((prev) => prev + (Math.random() * 0.05));
    }, 10000);
    
    return () => clearInterval(costInterval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const createConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      models: selectedModels,
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const addMessage = (message: Message) => {
    if (!currentConversation) return;
    
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, message],
    };
    
    setCurrentConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
    );
  };

  const updateModelRankings = (modelId: string, newRating: number) => {
    setModelRankings((prev) => ({
      ...prev,
      [modelId]: newRating,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedModels,
        setSelectedModels,
        conversations,
        currentConversation,
        createConversation,
        addMessage,
        isLoading,
        costSaved,
        availableModels,
        modelRankings,
        updateModelRankings,
        supabase,
        session,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};