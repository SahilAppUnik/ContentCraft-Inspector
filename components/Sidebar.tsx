'use client';

import { useState } from 'react';
import { Edit, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onModeChange: (mode: 'create' | 'analyze') => void;
  currentMode: 'create' | 'analyze';
}

export function Sidebar({ onModeChange, currentMode }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-card border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Content Tools</h2>
        <div className="space-y-2">
          <button
            onClick={() => onModeChange('create')}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
              currentMode === 'create'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            )}
          >
            <Edit size={20} />
            Create Content
          </button>
          <button
            onClick={() => onModeChange('analyze')}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
              currentMode === 'analyze'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            )}
          >
            <FileSearch size={20} />
            Analyze Content
          </button>
        </div>
      </div>
    </div>
  );
} 