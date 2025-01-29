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
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!rephrasedContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Content Rephrasing</h2>
          <p className="text-gray-600 text-center max-w-md mt-2">
            Click the &quot;Rephrase&quot; button to get a rephrased version of your content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="flex-1 overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rephrased Content Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 mb-6">
          <CardHeader className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Zap className="mr-2 text-blue-600" />
              Rephrased Content
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {rephrasedContent}
            </p>
          </CardContent>
        </Card>

        {/* Key Highlights Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Lightbulb className="mr-2 text-yellow-500" />
              Key Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <motion.li
                className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-100"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  1
                </span>
                <span className="text-gray-700 leading-relaxed">
                  Enhanced clarity and readability in the rephrased version
                </span>
              </motion.li>
              <motion.li
                className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-100"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  2
                </span>
                <span className="text-gray-700 leading-relaxed">
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