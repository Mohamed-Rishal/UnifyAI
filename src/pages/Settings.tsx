import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Moon, Sun, Key, Bell, Shield, Trash, RefreshCw, CheckCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { ModelProvider } from '../types';

const Settings: React.FC = () => {
  const { theme, toggleTheme, availableModels } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form states
  const [apiKeys, setApiKeys] = useState<Record<ModelProvider, string>>({
    'OpenAI': '',
    'Anthropic': '',
    'Google': '',
    'Cohere': '',
    'Meta': '',
    'Mistral': '',
    'Hugging Face': '',
    'Azure OpenAI': '',
  });
  
  const [preferences, setPreferences] = useState({
    defaultModel: 'gpt-4',
    costLimit: 10,
    enableNotifications: true,
    enableTelemetry: true,
  });
  
  const handleApiKeyChange = (provider: ModelProvider, value: string) => {
    setApiKeys({
      ...apiKeys,
      [provider]: value,
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  const clearAllData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all your data? This action cannot be undone.'
    );
    
    if (confirmed) {
      // In a real app, this would make an API call to delete user data
      console.log('Clearing all data...');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex border-b border-dark-300">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white hover:bg-dark-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'api-keys'
                ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white hover:bg-dark-300'
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'privacy'
                ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white hover:bg-dark-300'
            }`}
          >
            Privacy & Security
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'danger'
                ? 'bg-error-600/20 text-error-400 border-b-2 border-error-500'
                : 'text-gray-400 hover:text-white hover:bg-dark-300'
            }`}
          >
            Danger Zone
          </button>
        </div>
        
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                  <div>
                    <h3 className="font-medium mb-1">Theme</h3>
                    <p className="text-sm text-gray-400">Switch between light and dark themes</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md bg-dark-200 text-gray-300 hover:text-white"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-3">Default Model</h3>
                  <select
                    value={preferences.defaultModel}
                    onChange={(e) => setPreferences({ ...preferences, defaultModel: e.target.value })}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md p-2 text-white"
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-3">Cost Limit</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Set a monthly cost limit to prevent unexpected charges
                  </p>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">$</span>
                    <input
                      type="number"
                      value={preferences.costLimit}
                      onChange={(e) => setPreferences({ ...preferences, costLimit: Number(e.target.value) })}
                      min="0"
                      max="1000"
                      className="w-full bg-dark-400 border border-dark-200 rounded-md p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* API Keys */}
          {activeTab === 'api-keys' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <div className="ml-auto flex items-center text-xs bg-dark-300 px-3 py-1 rounded-full">
                  <Key size={12} className="mr-1" />
                  <span className="text-gray-400">Securely stored & encrypted</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                Add your API keys to connect to different AI providers. These keys are encrypted and never shared.
              </p>
              
              <div className="space-y-4">
                {Object.keys(apiKeys).map((provider) => (
                  <div key={provider} className="p-4 bg-dark-300 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{provider}</h3>
                      <a href="#" className="text-xs text-primary-400 hover:text-primary-300">
                        Get API Key
                      </a>
                    </div>
                    <div className="flex">
                      <input
                        type="password"
                        value={apiKeys[provider as ModelProvider]}
                        onChange={(e) => handleApiKeyChange(provider as ModelProvider, e.target.value)}
                        placeholder={`Enter your ${provider} API key`}
                        className="flex-1 bg-dark-400 border border-dark-200 rounded-l-md p-2 text-white"
                      />
                      <button className="bg-dark-200 hover:bg-dark-100 px-3 rounded-r-md text-gray-400">
                        Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
                <div className="ml-auto">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                Manage how your data is used and stored.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark-300 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Notifications</h3>
                    <p className="text-sm text-gray-400">Receive email notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableNotifications}
                      onChange={(e) =>
                        setPreferences({ ...preferences, enableNotifications: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-dark-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Usage Telemetry</h3>
                    <p className="text-sm text-gray-400">Help us improve by sending anonymous usage data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableTelemetry}
                      onChange={(e) =>
                        setPreferences({ ...preferences, enableTelemetry: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-dark-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-3">Data Retention Period</h3>
                  <select
                    className="w-full bg-dark-400 border border-dark-200 rounded-md p-2 text-white"
                  >
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="infinite">Indefinitely</option>
                  </select>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border border-error-700 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-error-500">Danger Zone</h2>
                <div className="ml-auto">
                  <Trash className="h-5 w-5 text-error-500" />
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                These actions cannot be undone. Please proceed with caution.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-2">Clear Conversation History</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Delete all your conversation history and start fresh
                  </p>
                  <Button variant="outline" size="sm">
                    Clear History
                  </Button>
                </div>
                
                <div className="p-4 bg-dark-300 rounded-lg">
                  <h3 className="font-medium mb-2">Reset API Keys</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Remove all stored API keys from your account
                  </p>
                  <Button variant="outline" size="sm">
                    Reset Keys
                  </Button>
                </div>
                
                <div className="p-4 bg-error-900/50 border border-error-800 rounded-lg">
                  <h3 className="font-medium text-error-400 mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={clearAllData}
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Footer with save button */}
        <div className="flex justify-end border-t border-dark-300 p-4">
          <div className="flex items-center">
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-success-500 mr-4"
              >
                <CheckCircle size={16} className="mr-1" />
                <span className="text-sm">Settings saved</span>
              </motion.div>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              icon={isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;