'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import AIScorePanel from '@/components/AIScorePanel';
import { motion } from 'framer-motion';
import { Edit, FileSearch, LogOut, Notebook as Robot, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/appwrite';

type Mode = 'create' | 'analyze' | 'ai-score';

export default function Home() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<Mode>('create');
  const [showStructured, setShowStructured] = useState(false);
  const [triggerAnalysis, setTriggerAnalysis] = useState(false);
  const [triggerAIScore, setTriggerAIScore] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const hasContent = content.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await logout(sessionToken);
        localStorage.removeItem('sessionToken');
      }
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    setMode('analyze');
    setTriggerAnalysis(true);
  };

  const handleAIScore = () => {
    setMode('ai-score');
    setTriggerAIScore(true);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setShowStructured(false);
    setTriggerAnalysis(false);
    setTriggerAIScore(false);
  };

  const handleShowProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 p-8 shrink-0 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">Content Tools</h2>
        <div className="space-y-4">
          <button
            onClick={() => {
              setMode('create');
              setShowStructured(false);
            }}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
              mode === 'create'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            <Edit className="h-7 w-7" />
            Create Content
          </button>
          <button
            onClick={() => handleModeChange('analyze')}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
              mode === 'analyze'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            <FileSearch className="h-7 w-7" />
            Analyze Content
          </button>
          <button
            onClick={() => handleModeChange('ai-score')}
            disabled={!hasContent}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
              mode === 'ai-score'
                ? 'bg-blue-600 text-white'
                : hasContent
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'opacity-50 cursor-not-allowed text-gray-400'
            )}
          >
            <Robot className="h-7 w-7" />
            AI Score
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-hidden bg-gray-50">
        <motion.div
          className="h-full flex flex-col max-w-[1800px] mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <motion.h1
              className="text-5xl font-bold text-gray-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              ContentCraft Inspector
            </motion.h1>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="w-full flex items-center gap-4 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <UserCircle className="h-7 w-7" />
                Profile
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={handleShowProfile}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <UserCircle className="h-5 w-5" />
                    Show Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}

            </div>
          </div>

          {mode === 'create' && !showStructured ? (
            // Single centered box for initial create mode
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[80%] h-[80%] bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
              >
                <ContentEditor
                  initialContent={content}
                  onContentChange={setContent}
                  mode={mode}
                  onCreate={() => setShowStructured(true)}
                  onAnalyze={() => setTriggerAnalysis(prev => !prev)}
                  onAIScore={() => setTriggerAIScore(prev => !prev)}
                />
              </motion.div>
            </div>
          ) : (
            // Two-column layout for other modes and after create
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-[calc(100%-4rem)] mt-6">
              {/* Left Box */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden"
              >
                <ContentEditor
                  initialContent={content}
                  onContentChange={setContent}
                  mode={mode}
                  onCreate={() => setShowStructured(true)}
                  onAnalyze={() => setTriggerAnalysis(prev => !prev)}
                  onAIScore={() => setTriggerAIScore(prev => !prev)}
                />
              </motion.div>

              {/* Right Column */}
              <div className="h-full flex flex-col">
                {mode === 'analyze' && (
                  <Tabs defaultValue="analysis" className="h-full flex flex-col">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <TabsList className="grid w-full grid-cols-3 bg-white p-0 rounded-xl border border-gray-100 shadow-lg">
                        <TabsTrigger
                          value="analysis"
                          className={cn(
                            "rounded-l-xl text-lg py-3",
                            "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                            "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                          )}
                        >
                          Analysis 📊
                        </TabsTrigger>
                        <TabsTrigger
                          value="outline"
                          className={cn(
                            "text-lg py-3",
                            "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                            "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                          )}
                        >
                          Outline 📝
                        </TabsTrigger>
                        <TabsTrigger
                          value="infogain"
                          className={cn(
                            "rounded-r-xl text-lg py-3",
                            "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                            "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                          )}
                        >
                          Info Gain 🧠
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Content Box */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-lg flex-1 mt-4 overflow-hidden"
                    >
                      <TabsContent value="analysis" className="h-full m-0 overflow-hidden">
                        <AnalysisPanel
                          content={content}
                          triggerAnalysis={triggerAnalysis}
                        />
                      </TabsContent>
                      <TabsContent value="outline" className="h-full m-0 overflow-hidden">
                        <OutlinePanel
                          content={content}
                          triggerOutline={triggerAnalysis}
                        />
                      </TabsContent>
                      <TabsContent value="infogain" className="h-full m-0 overflow-hidden">
                        <InfoGainPanel
                          content={content}
                          triggerInfoGain={triggerAnalysis}
                        />
                      </TabsContent>
                    </motion.div>
                  </Tabs>
                )}

                {mode === 'create' && showStructured && (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden"
                  >
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Structured Content</h2>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAnalyze}
                            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
                          >
                            <FileSearch className="h-5 w-5" />
                            Analyze Content
                          </button>
                          <button
                            onClick={handleAIScore}
                            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
                          >
                            <Robot className="h-5 w-5" />
                            Check AI Score
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 p-6 overflow-auto">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {mode === 'ai-score' && (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden"
                  >
                    <AIScorePanel
                      content={content}
                      triggerAIScore={triggerAIScore}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}