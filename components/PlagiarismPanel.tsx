import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

interface PlagiarismPanelProps {
  content: string;
  triggerPlagiarism: boolean;
}

interface PlagiarismResult {
  plagiarismScore: number;
  uniquenessScore: number;
  analysis: string;
  suggestions: string[];
  improvedVersion: string;
}

const PlagiarismPanel: React.FC<PlagiarismPanelProps> = ({
  content,
  triggerPlagiarism,
}) => {
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPlagiarism = async () => {
      if (!triggerPlagiarism || !content.trim()) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/plagiarism', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) {
          throw new Error('Failed to check plagiarism');
        }
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error checking plagiarism:', error);
        setError('Failed to check plagiarism. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkPlagiarism();
  }, [content, triggerPlagiarism]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-12 h-12 text-primary" />
          </motion.div>
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

  if (!result) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold">Plagiarism Check</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the "Check Plagiarism" button to analyze your content for potential plagiarism and get detailed insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Scores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <AlertTriangle className="mr-2" />
                Plagiarism Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plagiarism Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plagiarism Score</span>
                  <span className="font-medium">{result.plagiarismScore}%</span>
                </div>
                <Progress value={result.plagiarismScore} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {result.plagiarismScore}% potential plagiarism detected
                </p>
              </div>

              {/* Uniqueness Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uniqueness Score</span>
                  <span className="font-medium">{result.uniquenessScore}%</span>
                </div>
                <Progress value={result.uniquenessScore} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {result.uniquenessScore}% unique content
                </p>
              </div>

              {/* Analysis Text */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Analysis</h4>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Sparkles className="mr-2" />
                Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Suggestions List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Suggestions for Improvement</h4>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="text-sm bg-secondary/50 p-2 rounded-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Improved Version */}
              <div className="space-y-2">
                <h4 className="font-semibold">Improved Version</h4>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{result.improvedVersion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PlagiarismPanel;