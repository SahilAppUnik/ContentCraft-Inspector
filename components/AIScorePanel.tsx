'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Brain, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import router from 'next/router';
import { getUser } from '@/lib/user/appwrite';

interface AIScorePanelProps {
  content: string;
  triggerAIScore: boolean;
}

interface AIScoreResult {
  aiScore: number;
  humanScore: number;
  analysis: string;
  suggestions: string[];
  humanizedVersion: string;
}

const AIScorePanel: React.FC<AIScorePanelProps> = ({
  content,
  triggerAIScore,
}) => {
  const [result, setResult] = useState<AIScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHumanized, setShowHumanized] = useState(false);

  useEffect(() => {
    const checkAIScore = async () => {
      if (!triggerAIScore || !content.trim()) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze content');
        }

        const result = await response.json();
        console.log('result', result);
        
        setResult(result);

        const documentId = localStorage.getItem('documentId')
          if (documentId) {
            const res = await updateContent(documentId, {
              analysis: content,
              input: content,
              aiScore: result.aiScore,
              humanScore: result.humanScore,
              humanizedVersion: result.humanizedVersion
            })
            console.log('res', res);
            setResult(res);
            
          } else {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
              router.push('/auth/login');
              throw new Error('No session found');
            }
            const user = await getUser(sessionToken)
            const res = await saveContent(content, user.$id, content, 'ai-score')

            localStorage.setItem('documentId', res.$id);
          }
      } catch (error) {
        console.error('Error checking AI score:', error);
        setError('Failed to analyze AI content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAIScore();
  }, [content, triggerAIScore]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Content Analysis</h2>
          <p className="text-gray-600">
            Click on &quot;Verify&quot; button to analyze your content for AI influence and get a humanized version.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div 
        className="absolute inset-0 overflow-y-auto"
        style={{
          scrollbarColor: '#bab9b9 #f0f0f0',
        }}
      >
        <div className="p-6 space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="flex items-center text-xl text-gray-900">
                <Brain className="mr-2 text-blue-600" />
                AI Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* AI Score Section */}
                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">AI Influence</span>
                        <span className="font-bold text-blue-600">{result.aiScore}%</span>
                      </div>
                      <Progress value={result.aiScore} className="h-3 bg-blue-100" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Human Touch</span>
                        <span className="font-bold text-green-600">{result.humanScore}%</span>
                      </div>
                      <Progress value={result.humanScore} className="h-3 bg-green-100" />
                    </div>
                  </div>
                </motion.div>

                {/* Analysis Section */}
                <motion.div
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Analysis</h3>
                  <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
                </motion.div>

                {/* Suggestions Section */}
                {/* {result.suggestions && result.suggestions.length > 0 && (
                  <motion.div
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Suggestions</h3>
                    <ul className="space-y-3">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex gap-3 text-gray-700">
                          <span className="text-blue-500">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )} */}

                {/* Humanized Version Section */}
                <motion.div
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Humanized Version</h3>
                    <Button
                      onClick={() => setShowHumanized(!showHumanized)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {showHumanized ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showHumanized && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {result.humanizedVersion}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AIScorePanel;