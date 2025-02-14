import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSearch, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownRenderer from './MarkdownRenderer';

interface StructuredViewProps {
  content: string; // HTML content
  onAnalyze: () => void;
  onAIScore: () => void;
}

const StructuredView: React.FC<StructuredViewProps> = ({
  content,
  onAnalyze,
  onAIScore,
}) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Structured Content</h2>
        <div className="flex gap-2">
          <Button
            onClick={onAnalyze}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <FileSearch className="h-5 w-5" />
            Analyze Content
          </Button>
          <Button
            onClick={onAIScore}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Bot className="h-5 w-5" />
            Check AI Score
          </Button>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default StructuredView;
