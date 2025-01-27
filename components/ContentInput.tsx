import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  onAnalyze: () => void;
  buttonText?: string;
}

const ContentInput: React.FC<ContentInputProps> = ({
  content,
  setContent,
  onAnalyze,
  buttonText = "Analyze"
}) => {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setCharCount(content.length);
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  return (
    <div className="h-full flex flex-col gap-8 p-8">
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your content here to analyze..."
          className="h-full min-h-[600px] resize-none text-lg p-8 rounded-xl"
        />
      </div>
      <div className="flex justify-between items-center">
        <motion.div
          className="flex space-x-8 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </motion.div>
        <Button
          onClick={onAnalyze}
          disabled={content.trim().length === 0}
          className="gap-3 px-8 py-6 text-lg rounded-xl"
          size="lg"
        >
          <Zap className="h-7 w-7" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ContentInput;