import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

const FeedbackButton: React.FC = () => {
  const { supabase, session } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState<'bug' | 'feature' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Please sign in to submit feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: session.user.id,
            content: feedback,
            type: type,
          },
        ]);

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      setFeedback('');
      setType('other');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 transition-colors"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-400 rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-4">Send Feedback</h2>
              <p className="text-gray-400 mb-6">
                Help us improve UnifyAI by sharing your thoughts and suggestions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Feedback Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'bug' | 'feature' | 'other')}
                    className="w-full bg-dark-300 border border-dark-200 rounded-md px-4 py-2"
                  >
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full bg-dark-300 border border-dark-200 rounded-md px-4 py-2"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  fullWidth
                >
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;