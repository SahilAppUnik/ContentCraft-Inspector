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
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <motion.div
            className="w-16 h-16 border-t-4 border-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!rephrasedContent) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Content Rephrasing</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the &quot;Rephrase&quot; button to get a rephrased version of your content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rephrased Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Zap className="mr-2" />
            Rephrased Content
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-foreground whitespace-pre-wrap">{rephrasedContent}</p>
        </CardContent>
      </Card>

      {/* Key Highlights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Lightbulb className="mr-2" />
            Key Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            <motion.li
              className="flex items-center text-sm bg-secondary/50 p-2 rounded-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Enhanced clarity and readability in the rephrased version
            </motion.li>
            <motion.li
              className="flex items-center text-sm bg-secondary/50 p-2 rounded-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Maintained core message while improving expression
            </motion.li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RephrasedPanel;