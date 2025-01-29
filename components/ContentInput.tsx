import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Zap, Upload, FileText, FileSearch, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  onAnalyze: () => void;
  buttonText?: string;
  mode: 'create' | 'analyze' | 'ai-score';
}

const ContentInput: React.FC<ContentInputProps> = ({
  content,
  setContent,
  onAnalyze,
  mode,
  buttonText = "Analyze"
}) => {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCharCount(content.length);
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      setContent(text);
    } catch (error) {
      console.error('Error reading file:', error);
      // You might want to add error handling UI here
    }
  }, [setContent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const hasContent = content.trim().length > 0;

  return (
    <div className="h-full flex flex-col gap-4 p-6">
      <div className="flex gap-2 items-center">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.doc,.docx,.pdf,.md"
          className="hidden"
          id="file-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
        <p className="text-sm text-muted-foreground">
          Supported formats: .txt, .doc, .docx, .pdf, .md
        </p>
      </div>
      
      <div 
        className={`flex-1 relative min-h-0 ${isDragging ? 'border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative h-full flex flex-col">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to analyze or drag & drop a file..."
            className="h-full resize-none text-lg p-8 rounded-xl overflow-auto pr-[120px]"
          />
          {hasContent && (
            <Button
              onClick={onAnalyze}
              className="absolute right-4 top-4 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileSearch className="h-4 w-4" />
              Analyze
            </Button>
          )}
        </div>
        {isDragging && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl border-2 border-dashed border-primary">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="text-lg font-medium">Drop your file here</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-8 text-lg text-muted-foreground">
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </div>
        {mode === 'analyze' && (
          <div className="flex gap-4">
            <Button
              onClick={onAnalyze}
              disabled={!hasContent}
              className="gap-3 px-8 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Wand2 className="h-7 w-7" />
              Analyze
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentInput;