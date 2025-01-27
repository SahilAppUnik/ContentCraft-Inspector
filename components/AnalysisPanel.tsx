import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisPanelProps {
  content: string;
  triggerAnalysis: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  content,
  triggerAnalysis,
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeContent = async () => {
      if (!triggerAnalysis || !content.trim()) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) {
          throw new Error('Failed to analyze content');
        }
        const result = await response.json();
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing content:', error);
        setError('Failed to analyze content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeContent();
  }, [content, triggerAnalysis]);

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

  if (!analysis) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Content Analysis</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the "Analyze" button to get detailed insights about your content.
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
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Type className="h-6 w-6" />, label: 'Word Count', value: analysis.wordCount },
              { icon: <Clock className="h-6 w-6" />, label: 'Reading Time', value: `${analysis.readingTime} min` },
              { icon: <Type className="h-6 w-6" />, label: 'Readability', value: `${analysis.readability}%` },
              { icon: <Zap className="h-6 w-6" />, label: 'Content Score', value: `${analysis.contentScore}%` },
            ].map((metric, index) => (
              <motion.div
                key={`metric-${index}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-secondary rounded-md">
                        {metric.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisPanel;