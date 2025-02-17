'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import AIScorePanel from '@/components/AIScorePanel';
import { motion } from 'framer-motion';
import { Edit, FileSearch, LogOut, Notebook as Robot, UserCircle, Wand2, History, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/user/appwrite';
import AIGeneratePanel from '@/components/AIGeneratePanel';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import MarkdownRenderer, { getDownloadableContent } from '@/components/MarkdownRenderer';

type AppMode = 'ai-generate' | 'create' | 'analyze' | 'ai-score';

export default function Dashboard() {
  // States
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [mode, setMode] = useState<AppMode>('ai-generate');
  const [showStructured, setShowStructured] = useState(false);
  const [triggerAnalysis, setTriggerAnalysis] = useState(false);
  const [triggerAIScore, setTriggerAIScore] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAIGenerateAnalysis, setShowAIGenerateAnalysis] = useState(false);
  const [showAIGenerateScore, setShowAIGenerateScore] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [title, setTitle] = useState<string>('GeneratedContent');

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const hasContent = content.trim().length > 0 || generatedContent.trim().length > 0;

  useEffect(() => {
    localStorage.removeItem("documentId");
  }, [])

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

  useEffect(() => {
    const loadHistoryState = () => {
      const savedState = localStorage.getItem('dashboardState');
      console.log('savedState', savedState);
      
      if (savedState) {
        const { id, mode, content, documentId, fromHistory, analysis } = JSON.parse(savedState);
  
        setMode(mode as AppMode); // Set the mode dynamically
        setContent(content);
        setAnalysis(analysis)
        setDocumentId(documentId);
        setFromHistory(true);
  
        switch (mode) {
          case 'analyze':
            setTriggerAnalysis(true);
            setShowStructured(true);
            setAnalysis(analysis);
            break;
  
          case 'ai-score':
            setTriggerAIScore(true);
            setShowStructured(true);
            setAnalysis(analysis);
            break;
  
          case 'ai-generate':
            setGeneratedContent(analysis);
            setHasGeneratedContent(true);
            setAnalysis(analysis);
            break;
  
          case 'create':
            setShowStructured(true);
            break;
        }
        localStorage.removeItem('dashboardState'); // Remove data after loading
      }
    };
  
    loadHistoryState();
  }, []);

  const BackToHistoryButton = () => {
    if (!fromHistory) return null;

    return (
      <button
        onClick={() => router.push('/history')}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to History
      </button>
    );
  };

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

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    router.push(`/dashboard?mode=${newMode}${documentId ? `&documentId=${documentId}` : ''}`);
    setShowStructured(false);
    setTriggerAnalysis(false);
    setTriggerAIScore(false);
    setShowAIGenerateAnalysis(false);
    setShowAIGenerateScore(false);
    setHasGeneratedContent(false);
    setGeneratedContent('');
  };
  const handleShowProfile = () => {
    router.push('/profile');
  };

  const handleHistory = () => {
    router.push('/history');
  }

  const handleGeneratedContent = (generatedContent: string) => {
    setGeneratedContent(generatedContent);
    setContent(generatedContent);
    setHasGeneratedContent(true);
    setTitle(generatedContent.split('\n')[0] || 'GeneratedContent');
  };

  const downloadAsWord = () => {
    if (!generatedContent.trim()) return;
  
    // Convert Markdown to structured text
    const formattedContent = getDownloadableContent(generatedContent, 'docx');
  
    const doc = new Document({
      sections: [
        {
          children: formattedContent.split('\n').map((line) => {
            if (line.startsWith('--- ')) {
              return new Paragraph({
                text: line.replace('--- ', ''),
                heading: HeadingLevel.HEADING_1,
              });
            } else if (line.startsWith('-- ')) {
              return new Paragraph({
                text: line.replace('-- ', ''),
                heading: HeadingLevel.HEADING_2,
              });
            } else if (line.startsWith('- ')) {
              return new Paragraph({
                text: line.replace('- ', ''),
                heading: HeadingLevel.HEADING_3,
              });
            } else if (line.startsWith('• ')) {
              return new Paragraph({
                children: [new TextRun(line.replace('• ', ''))],
                bullet: { level: 0 },
              });
            } else if (line.startsWith('1. ')) {
              return new Paragraph({
                children: [new TextRun(line.replace('1. ', ''))],
                numbering: { reference: "ordered-list", level: 0 },
              });
            } else {
              return new Paragraph(line);
            }
          }),
        },
      ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title || 'GeneratedContent'}.docx`);
    });
  };

  return (
    <div className="min-h-screen h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 p-8 shrink-0 bg-gray-50 flex flex-col h-screen">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">Content Tools</h2>

        <div className="space-y-4 flex-grow">
          {/* AI Generate Button */}
          <button
            onClick={() => handleModeChange('ai-generate')}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
              mode === 'ai-generate'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            <Wand2 className="h-7 w-7" />
            AI-Powered
          </button>

          {/* Create Content Button */}
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
            Smart Editor
          </button>

          {/* Analyze Content Button */}
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
            Deep Analysis
          </button>

          {/* AI Score Button */}
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
            Realness Score
          </button>

          {/* History Button at Bottom & Centered */}
          <div className="flex flex-col items-center mt-auto">
            <button
              onClick={handleHistory}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg hover:bg-gray-100 text-gray-700"
            >
              <History className="h-7 w-7" />
              History
            </button>
          </div>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <BackToHistoryButton />
              <motion.h1
                className="text-5xl font-bold text-gray-900"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                ContentCraft Inspector
              </motion.h1>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-4 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <UserCircle className="h-7 w-7" />
                Profile
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleShowProfile}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle className="h-5 w-5" />
                    Show Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {mode === 'ai-generate' && !hasGeneratedContent ? (
              // Initial full-screen input view for AI Generate
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-[80%] bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
                >
                  <div className="h-full flex flex-col p-8">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-xl font-semibold">AI-Powered Content</h2>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                      <AIGeneratePanel onContentGenerated={handleGeneratedContent} />
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : mode === 'ai-generate' && hasGeneratedContent ? (
              // Two-column layout after content generation
              <div className="grid grid-cols-2 gap-10 h-full">
                {/* Left Column - Input Panel */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden flex flex-col"
                >
                  <div className="p-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-semibold">Generate New Content</h2>
                  </div>
                  <div className="flex-1 overflow-auto p-6">
                    <AIGeneratePanel onContentGenerated={handleGeneratedContent} />
                  </div>
                </motion.div>

                {/* Right Column - Output and Analysis */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full flex flex-col"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-semibold">Generated Content</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAnalyze}
                        className="gap-2 px-4 py-2 rounded-lg flex items-center bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <FileSearch className="h-5 w-5" />
                        Analyze
                      </button>
                      <button
                        onClick={handleAIScore}
                        className="gap-2 px-4 py-2 rounded-lg flex items-center bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Robot className="h-5 w-5" />
                        AI Score
                      </button>
                      <button
                        onClick={downloadAsWord}
                        className="gap-2 px-4 py-2 rounded-lg flex items-center bg-green-600 text-white hover:bg-green-700"
                      >
                        📄 Download as Word
                      </button>
                    </div>
                  </div>
                  {/* Scrollable Content */}
                  <div className="flex-1 p-6 overflow-auto" style={{ position: 'relative', overflowY: 'auto', scrollbarColor: '#bab9b9 #f0f0f0' }}>
                    <div className="prose max-w-none" style={{ position: 'absolute', paddingRight: '10px' }}>
                      <MarkdownRenderer content={generatedContent} />
                    </div>
                  </div>
                  {/* Analysis/Score Panel */}
                  {(showAIGenerateAnalysis || showAIGenerateScore) && (
                    <div className="border-t border-gray-100 flex-1 overflow-hidden">
                      {showAIGenerateAnalysis && (
                        <Tabs defaultValue="analysis" className="h-full flex flex-col">
                          <TabsList className="grid w-full grid-cols-3 bg-white p-4 border-b border-gray-100">
                            <TabsTrigger value="analysis">Analysis 📊</TabsTrigger>
                            <TabsTrigger value="outline">Outline 📝</TabsTrigger>
                            <TabsTrigger value="infogain">Info Gain 🧠</TabsTrigger>
                          </TabsList>
                          <div className="flex-1 overflow-auto">
                            <TabsContent value="analysis" className="p-4">
                              <AnalysisPanel content={generatedContent} triggerAnalysis={showAIGenerateAnalysis} />
                            </TabsContent>
                            <TabsContent value="outline" className="p-4">
                              <OutlinePanel content={generatedContent} triggerOutline={showAIGenerateAnalysis} />
                            </TabsContent>
                            <TabsContent value="infogain" className="p-4">
                              <InfoGainPanel content={generatedContent} triggerInfoGain={showAIGenerateAnalysis} />
                            </TabsContent>
                          </div>
                        </Tabs>
                      )}
                      {showAIGenerateScore && (
                        <div className="p-4 flex-1 overflow-auto">
                          <AIScorePanel content={generatedContent} triggerAIScore={showAIGenerateScore} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            ) : mode === 'create' && !showStructured ? (
              // Single centered box for initial create mode
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden"
                >
                  <ContentEditor
                    initialContent={analysis}
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
              <div className="grid grid-cols-2 gap-10 h-full">
                {/* Left Box */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg h-[calc(100vh-200px)] overflow-hidden"
                >
                  <ContentEditor
                    initialContent={generatedContent}
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
                    <Tabs defaultValue="analysis" className="h-[calc(100vh-200px)] flex flex-col">
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

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-lg flex-1 overflow-hidden"
                      >
                        <TabsContent value="analysis" className="h-full m-0 p-4 overflow-auto">
                          <AnalysisPanel
                            content={analysis}
                            triggerAnalysis={triggerAnalysis}
                          />
                        </TabsContent>
                        <TabsContent value="outline" className="h-full m-0 p-4 overflow-auto">
                          <OutlinePanel
                            content={analysis}
                            triggerOutline={triggerAnalysis}
                          />
                        </TabsContent>
                        <TabsContent value="infogain" className="h-full m-0 p-4 overflow-auto">
                          <InfoGainPanel
                            content={analysis}
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
                      className="bg-white rounded-2xl border border-gray-100 shadow-lg h-[calc(100vh-200px)] overflow-hidden"
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
                        <div className="flex-1 p-6 overflow-auto" style={{ position: 'relative', overflowY: 'auto', scrollbarColor: '#bab9b9 #f0f0f0' }}>
                    <div className="prose max-w-none" style={{ position: 'absolute', paddingRight: '10px' }}>
                    <MarkdownRenderer content={analysis} />
                    </div>
                </div>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'ai-score' && (
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-lg h-[calc(100vh-200px)] overflow-hidden"
                    >
                      <div className="p-4 h-full overflow-auto">
                        <AIScorePanel
                          content={analysis}
                          triggerAIScore={triggerAIScore}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}