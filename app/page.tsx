'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentInput from '../components/ContentInput';
import { ContentEditor } from '../components/ContentEditor';
import AnalysisPanel from '../components/AnalysisPanel';
import OutlinePanel from '../components/OutlinePanel';
import InfoGainPanel from '../components/InfoGainPanel';
import RephrasedPanel from '../components/RephrasedPanel';
import PlagiarismPanel from '../components/PlagiarismPanel';
import { motion } from 'framer-motion';
import { Edit, FileSearch, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'create' | 'analyze' | 'plagiarism';

export default function Home() {
  const [analyzeContent, setAnalyzeContent] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [plagiarismContent, setPlagiarismContent] = useState('');
  const [mode, setMode] = useState<Mode>('create');

  const [analyzeModeTrigger, setAnalyzeModeTrigger] = useState(false);
  const [createModeTrigger, setCreateModeTrigger] = useState(false);
  const [plagiarismTrigger, setPlagiarismTrigger] = useState(false);

  const handleAnalyzeFromInput = () => {
    setAnalyzeModeTrigger(prev => !prev);
  };

  const handleAnalyzeFromEditor = (newContent: string) => {
    setCreateContent(newContent);
    setCreateModeTrigger(prev => !prev);
  };

  const handlePlagiarismCheck = () => {
    setPlagiarismTrigger(prev => !prev);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setAnalyzeModeTrigger(false);
    setCreateModeTrigger(false);
    setPlagiarismTrigger(false);
  };

  return (
    <div className="min-h-screen h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 p-8 shrink-0 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">Content Tools</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleModeChange('create')}
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
            onClick={() => handleModeChange('plagiarism')}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
              mode === 'plagiarism'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            <Shield className="h-7 w-7" />
            Check Plagiarism
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-10 overflow-hidden bg-gray-50">
        <motion.div
          className="h-full flex flex-col max-w-[1800px] mx-auto space-y-6"
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
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Panel - Aligned with right box */}
            {!mode.includes('plagiarism') && (
              <div className="flex justify-end mb-4 w-full">
                <div className="w-[calc(50%-20px)]">
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="w-full grid grid-cols-4 bg-white p-0 rounded-xl border border-gray-100 shadow-lg">
                      <TabsTrigger
                        value="analysis"
                        className={cn(
                          "rounded-xl text-lg py-3",
                          "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                          "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600",
                          "border-0 hover:bg-gray-50"
                        )}
                      >
                        Analysis 📊
                      </TabsTrigger>
                      <TabsTrigger
                        value="outline"
                        className={cn(
                          "rounded-xl text-lg py-3",
                          "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                          "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600",
                          "border-0 hover:bg-gray-50"
                        )}
                      >
                        Outline 📝
                      </TabsTrigger>
                      <TabsTrigger
                        value="infogain"
                        className={cn(
                          "rounded-xl text-lg py-3",
                          "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                          "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600",
                          "border-0 hover:bg-gray-50"
                        )}
                      >
                        Info Gain 🧠
                      </TabsTrigger>
                      <TabsTrigger
                        value="rephrased"
                        className={cn(
                          "rounded-xl text-lg py-3",
                          "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                          "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600",
                          "border-0 hover:bg-gray-50"
                        )}
                      >
                        Rephrased ✍️
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0">
              {/* Left Box */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden flex flex-col"
              >
                {mode === 'plagiarism' ? (
                  <ContentInput
                    content={plagiarismContent}
                    setContent={setPlagiarismContent}
                    onAnalyze={handlePlagiarismCheck}
                    buttonText="Check Plagiarism"
                  />
                ) : mode === 'create' ? (
                  <ContentEditor 
                    initialContent={createContent}
                    onAnalyze={handleAnalyzeFromEditor}
                  />
                ) : (
                  <ContentInput
                    content={analyzeContent}
                    setContent={setAnalyzeContent}
                    onAnalyze={handleAnalyzeFromInput}
                  />
                )}
              </motion.div>

              {/* Right Box */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden"
              >
                {mode === 'plagiarism' ? (
                  <PlagiarismPanel
                    content={plagiarismContent}
                    triggerPlagiarism={plagiarismTrigger}
                  />
                ) : (
                  <Tabs defaultValue="analysis" className="h-full">
                    <TabsContent value="analysis" className="h-full m-0">
                      <AnalysisPanel
                        content={mode === 'create' ? createContent : analyzeContent}
                        triggerAnalysis={mode === 'create' ? createModeTrigger : analyzeModeTrigger}
                      />
                    </TabsContent>
                    <TabsContent value="outline" className="h-full m-0">
                      <OutlinePanel
                        content={mode === 'create' ? createContent : analyzeContent}
                        triggerOutline={mode === 'create' ? createModeTrigger : analyzeModeTrigger}
                      />
                    </TabsContent>
                    <TabsContent value="infogain" className="h-full m-0">
                      <InfoGainPanel 
                        content={mode === 'create' ? createContent : analyzeContent}
                        triggerInfoGain={mode === 'create' ? createModeTrigger : analyzeModeTrigger}
                      />
                    </TabsContent>
                    <TabsContent value="rephrased" className="h-full m-0">
                      <RephrasedPanel
                        content={mode === 'create' ? createContent : analyzeContent}
                        triggerRephrase={mode === 'create' ? createModeTrigger : analyzeModeTrigger}
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}