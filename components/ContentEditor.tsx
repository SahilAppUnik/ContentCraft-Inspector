'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ContentEditorProps {
  initialContent?: string;
  onAnalyze: (content: string) => void;
}

export function ContentEditor({ initialContent = '', onAnalyze }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleEditorChange = (content: string) => {
    setContent(content);
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    setCharCount(plainText.length);
    setWordCount(plainText.split(/\s+/).filter(Boolean).length);
  };

  const handleAnalyze = () => {
    onAnalyze(content);
  };

  if (!isMounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="h-full flex flex-col gap-6 p-6">
        <div className="flex-1 relative border rounded-lg overflow-hidden bg-[#0d0d0d] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
      {/* <div className="flex-1 relative border rounded-lg overflow-hidden bg-background"> */}
        <Editor
          apiKey="hx0u9onhfwzvqbi9esurnf5zia44rxl7avp9qycpveh3meoe"
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: '100%',
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
              'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount'
            ],
            toolbar: [
              { name: 'history', items: ['undo', 'redo'] },
              { name: 'styles', items: ['styleselect'] },
              { name: 'formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
              { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
              { name: 'lists', items: ['numlist', 'bullist'] },
              { name: 'indentation', items: ['outdent', 'indent'] },
              { name: 'insert', items: ['link', 'image', 'table'] },
              { name: 'view', items: ['preview', 'fullscreen'] }
            ],
            skin: isDark ? 'oxide-dark' : 'oxide',
            content_css: isDark ? 'dark' : 'default',
            content_style: `
              :root {
                color-scheme: ${isDark ? 'dark' : 'light'};
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, 
                           Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                padding: 1rem;
                background-color: #1c1c1c !important;
                color: #ffffff !important;
              }
              
              .tox-toolbar {
                background-color: #2a2a2a !important;
                border-bottom: 1px solid #333333 !important;
              }
              
              .tox-toolbar__primary {
                background-color: #2a2a2a !important;
                border-bottom: 1px solid #333333 !important;
              }
              
              .tox-toolbar-overlord {
                background-color: #2a2a2a !important;
              }
              
              .tox-menubar {
                background-color: #2a2a2a !important;
                border-bottom: 1px solid #333333 !important;
              }
              
              .tox.tox-tinymce {
                border: 1px solid #333333 !important;
                border-radius: 0.75rem !important;
                overflow: hidden;
              }
              
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                color: #666666 !important;
              }
            `,
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            browser_spellcheck: true,
            contextmenu: false,
            resize: true,
            placeholder: 'Start writing your content...',
            setup: (editor) => {
              editor.on('init', () => {
                const editorContainer = editor.getContainer();
                editorContainer.style.transition = "border-color 0.15s ease-in-out";
                
                // Force dark mode on the iframe
                const editorIframe = editorContainer.querySelector('iframe');
                if (editorIframe) {
                  const iframeDocument = editorIframe.contentDocument;
                  if (iframeDocument) {
                    iframeDocument.documentElement.style.backgroundColor = '#1c1c1c';
                  }
                }
              });
            }
          }}
        //   className="rounded-xl overflow-hidden"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-8 text-lg text-muted-foreground">
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!content.trim()}
          className="gap-3 px-8 py-6 text-lg rounded-xl"
          size="lg"
        >
          <Zap className="h-7 w-7" />
          Analyze
        </Button>
      </div>
    </div>
  );
}

export default ContentEditor;