import { useState, useEffect } from 'react';
import {
  Brain,
  Zap,
  Sparkles,
  Hash,
  TrendingUp,
  Moon,
  Sun,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AnalysisMetrics } from './types/analysis';
import { Theme } from './types/theme';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const AnalysisPanel = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const pathname = usePathname();

  const {
    data: metrics,
    refetch,
    isLoading,
  } = useQuery<AnalysisMetrics>({
    queryKey: ['analysis', pathname],
    enabled: !!pathname && pathname !== '/',
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const renderMetricCard = ({
    icon,
    label,
    value,
    variant = 'primary',
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    variant?: 'primary' | 'secondary' | 'accent';
  }) => (
    <div className={cn(
      "p-4 rounded-lg shadow-md flex items-center justify-between",
      {
        'bg-gradient-to-r from-primary to-secondary': variant === 'primary',
        'bg-gradient-to-r from-secondary to-accent': variant === 'secondary',
        'bg-gradient-to-r from-accent to-primary': variant === 'accent',
      }
    )}>
      <div className="flex items-center gap-2">
        <div className="text-primary-foreground">{icon}</div>
        <p className="text-primary-foreground font-medium">{label}</p>
      </div>
      <p className="text-primary-foreground font-bold">{value}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 text-foreground">Analysis</h2>
      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          {renderMetricCard({
            icon: <Zap size={20} />,
            label: 'Words',
            value: metrics.wordCount,
            variant: 'primary'
          })}
          {renderMetricCard({
            icon: <Hash size={20} />,
            label: 'Hashtags',
            value: metrics.hashtagCount,
            variant: 'secondary'
          })}
          {renderMetricCard({
            icon: <Sparkles size={20} />,
            label: 'Emojis',
            value: metrics.emojiCount,
            variant: 'accent'
          })}
          {renderMetricCard({
            icon: <TrendingUp size={20} />,
            label: 'Headers',
            value: metrics.headerCount,
            variant: 'primary'
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AnalysisPanel;