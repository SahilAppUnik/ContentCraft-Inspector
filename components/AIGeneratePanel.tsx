import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2 } from 'lucide-react';

interface AIGeneratePanelProps {
  onContentGenerated: (content: string) => void;
}

export default function AIGeneratePanel({ onContentGenerated }: AIGeneratePanelProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      // Replace with your actual GPT API call
      const response = await fetch('/api/ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      const data = await response.json();
      setGeneratedContent(data.content);
      onContentGenerated(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Input Section - Fixed at top */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Generate AI Content</h2>
        <p className="text-gray-600 mb-4">
          Enter a title or topic, and our AI will generate detailed content for you.
        </p>
        <div className="flex gap-4">
          <Input
            placeholder="Enter title or topic..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={generateContent}
            disabled={!title.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        {generatedContent && (
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
          </div>
        )}
      </div>
    </div>
  );
}