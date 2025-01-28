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

  if (!outlineResult) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Content Outline</h2>
          <p className="text-muted-foreground text-center max-w-md">
          Click the &quot;Outline&quot; button to get detailed insights about your content.
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
      <Card>
        <CardHeader className='p-4 bg-blue-500'>
          <CardTitle className="flex items-center text-2xl">
            <List className="mr-2" />
            Content Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {outlineResult.outline.length > 0 ? (
            <ul className="space-y-2">
              {outlineResult.outline.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-sm"
                  style={{ marginLeft: `${(item.level - 1) * 20}px` }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full bg-primary mr-2"
                    style={{ opacity: 1 - (item.level - 1) * 0.2 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {item.text}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No outline structure detected. Consider adding headers to organize your content.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Section */}
      <Card>
        <CardHeader className='p-4 bg-blue-500'>
          <CardTitle className="flex items-center text-2xl">
            <Lightbulb className="mr-2" />
            Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {outlineResult.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className="flex items-center text-sm bg-secondary/50 p-2 rounded-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Content Gaps Section */}
      <Card>
        <CardHeader className='p-4 bg-blue-500'>
          <CardTitle className="flex items-center text-2xl">
            <AlertTriangle className="mr-2" />
            Content Gaps
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {outlineResult.contentGaps.map((gap, index) => (
              <motion.li
                key={index}
                className="flex items-center text-sm bg-secondary/50 p-2 rounded-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {gap}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutlinePanel;