import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Lightbulb, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OutlinePanelProps {
  content: string;
  triggerOutline: boolean;
}

interface OutlineItem {
  level: number;
  text: string;
}

interface OutlineResult {
  outline: OutlineItem[];
  suggestions: string[];
  contentGaps: string[];
}

const OutlinePanel: React.FC<OutlinePanelProps> = ({
  content,
  triggerOutline,
}) => {
  const [outlineResult, setOutlineResult] = useState<OutlineResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateOutline = async () => {
      if (!triggerOutline || !content.trim()) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/outline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate outline');
        }
        const result = await response.json();
        setOutlineResult(result);
      } catch (error) {
        console.error('Error generating outline:', error);
        setError('Failed to generate outline. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateOutline();
  }, [content, triggerOutline]);

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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!outlineResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Content Outline</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the &quot;Outline&quot; button to get detailed insights about your content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
      <div className="p-6 space-y-6">
      <motion.div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <List className="mr-2" />
              Content Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            {outlineResult.outline.length > 0 ? (
              <ul className="space-y-4">
                {outlineResult.outline.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-base"
                    style={{ marginLeft: `${(item.level - 1) * 20}px` }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.span
                      className="w-2 h-2 rounded-full bg-blue-600 mr-2 mt-2"
                      style={{ opacity: 1 - (item.level - 1) * 0.2 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-gray-700">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                No outline structure detected. Consider adding headers to organize your content.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Lightbulb className="mr-2" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <ul className="space-y-4">
              {outlineResult.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-base border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <AlertTriangle className="mr-2" />
              Content Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <ul className="space-y-4">
              {outlineResult.contentGaps.map((gap, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-base border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{gap}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </div>
    </div>
  );
};

export default OutlinePanel;