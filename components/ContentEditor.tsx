'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type ReactQuill from 'react-quill';

// Dynamic import of ReactQuill with proper ref handling
const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // Register custom font whitelist
    const Quill = (await import('quill')).default;
    const Font = Quill.import('formats/font');
    Font.whitelist = [
      'Arial',
      'TimesNewRoman',
      'Helvetica',
      'CourierNew',
      'Georgia',
      'TrebuchetMS',
      'Verdana',
      'Impact',
      'ComicSansMS',
      'Tahoma'
    ];
    Quill.register(Font, true);
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { 
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);

// Custom font list with display names
const fontFamilyList = [
  'Arial',
  'TimesNewRoman',
  'Helvetica',
  'CourierNew',
  'Georgia',
  'TrebuchetMS',
  'Verdana',
  'Impact',
  'ComicSansMS',
  'Tahoma'
];

// Custom font size list
const fontSizeList = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '36px', '48px', '60px', '72px'];

interface ContentEditorProps {
  initialContent?: string;
  onAnalyze: (content: string) => void;
}

export function ContentEditor({ initialContent = '', onAnalyze }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const quillRef = useRef<ReactQuill>(null);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Update word and character count when content changes
  useEffect(() => {
    if (!content) {
      setCharCount(0);
      setWordCount(0);
      return;
    }

    // Remove HTML tags and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    setCharCount(plainText.length);
    setWordCount(plainText.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  // Custom handlers for links
  const handleLink = () => {
    if (!quillRef.current) return;
    
    const editor = quillRef.current.getEditor();
    const selection = editor.getSelection();
    
    if (selection) {
      const url = prompt('Enter URL:');
      if (url) {
        editor.format('link', url);
      }
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': fontFamilyList }],
        [{ 'size': fontSizeList }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [
          { 'list': 'ordered'},
          { 'list': 'bullet'},
          { 'indent': '-1'},
          { 'indent': '+1' }
        ],
        [{ 'direction': 'rtl' }],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        link: handleLink
      }
    },
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            return true;
          }
        }
      }
    }
  }), []);

  const formats = [
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ];

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleAnalyze = () => {
    onAnalyze(content);
  };

  // Get plain text content for button disabled state
  const getPlainText = () => {
    if (!content) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex-1 relative">
        <QuillWrapper
          forwardedRef={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="h-[calc(100%-60px)] text-lg"
          placeholder="Start writing your content..."
        />
      </div>
      <div className="flex justify-between items-center">
        <motion.div
          className="flex space-x-8 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </motion.div>
        <Button
          onClick={handleAnalyze}
          disabled={!getPlainText().trim()}
          className="gap-3 px-8 py-6 text-lg rounded-xl"
          size="lg"
        >
          <Zap className="h-6 w-6" />
          Analyze
        </Button>
      </div>
    </div>
  );
}