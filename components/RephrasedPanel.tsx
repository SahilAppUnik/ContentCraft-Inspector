import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface RephrasedPanelProps {
  content: string;
  triggerRephrase: boolean;
}

const RephrasedPanel: React.FC<RephrasedPanelProps> = ({
  content,
  triggerRephrase,
}) => {
  const [rephrasedContent, setRephrasedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rephraseContent = async () => {
      if (!triggerRephrase || !content.trim()) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/rephrase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error('Failed to rephrase content');
        }

        const result = await response.json();
        setRephrasedContent(result);
      } catch (error) {
        console.error('Error rephrasing content:', error);
        setError('Failed to rephrase content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    rephraseContent();
  }, [content, triggerRephrase]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-t-4 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!rephrasedContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Content Rephrasing</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the &quot;Rephrase&quot; button to get a rephrased version of your content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <motion.div
        className="flex-1 overflow-y-auto pr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rephrased Content Section */}
        <Card className="mb-6">
          <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <Zap className="mr-2" />
              Rephrased Content
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {rephrasedContent}
            </p>
          </CardContent>
        </Card>

        {/* Key Highlights Section */}
        <Card>
          <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <CardTitle className="flex items-center text-2xl text-gray-900">
              <Lightbulb className="mr-2" />
              Key Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50">
            <ul className="space-y-3">
              <motion.li
                className="flex items-center text-sm p-3 rounded-lg bg-white border border-gray-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">
                  Enhanced clarity and readability in the rephrased version
                </span>
              </motion.li>
              <motion.li
                className="flex items-center text-sm p-3 rounded-lg bg-white border border-gray-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">
                  Maintained core message while improving expression
                </span>
              </motion.li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RephrasedPanel;