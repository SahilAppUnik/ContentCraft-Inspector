'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from './ui/button';
import { Wand2, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ContentEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  mode: 'ai-generate' | 'create' | 'analyze' | 'ai-score';
  onCreate: () => void;
  onAnalyze: () => void;
  onAIScore: () => void;
}

export function ContentEditor({
  initialContent,
  onContentChange,
  mode,
  onCreate,
  onAnalyze,
  onAIScore
}: ContentEditorProps) {
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

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
    const plainText = newContent.replace(/<[^>]*>/g, '').trim();
    setCharCount(plainText.length);
    setWordCount(plainText.split(/\s+/).filter(Boolean).length);
  };

  const hasContent = content.trim().length > 0;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex-1 relative border rounded-lg overflow-auto bg-white shadow-lg">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: '100%',
            menubar: true,
            branding: false,
            statusbar: false,
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
            skin: 'oxide',
            content_css: 'default',
            content_style: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, 
                   Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      padding: 1rem;
      background-color: #ffffff !important;
      color: #000000 !important;
      min-height: calc(100vh - 120px);
      cursor: text;
    }
    
    .tox-toolbar {
      background-color: #f8f9fb !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }
    
    .tox-toolbar__primary {
      background-color: #f8f9fb !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }
    
    .tox-toolbar-overlord {
      background-color: #f8f9fb !important;
    }
    
    .tox-menubar {
      background-color: #f8f9fb !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }
    
    .tox.tox-tinymce {
      border: 1px solid #e2e8f0 !important;
      border-radius: 0.75rem !important;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    
    .tox-statusbar {
      display: none !important;
    }
    
    .tox-tinymce-aux {
      z-index: 99999;
    }
    
    /* Fix placeholder alignment */
    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
      color: #94a3b8 !important;
      position: absolute;
      left: 1rem;
      top: 1rem;
      font-size: 16px;
      font-family: inherit;
      line-height: 1.5;
      content: attr(data-mce-placeholder);
      pointer-events: none;
    }

    /* Ensure consistent paragraph spacing */
    p {
      margin: 0;
      min-height: 1.5em;
    }

    /* Fix cursor alignment */
    .mce-content-body:not([dir=rtl])[data-mce-placeholder]:not(.mce-visualblocks)::before {
      left: 1rem;
    }
  `,
            // Ensure proper initial focus
            setup: (editor) => {
              editor.on('init', () => {
                const editorContainer = editor.getContainer();
                editorContainer.style.transition = "border-color 0.15s ease-in-out";

                // Set initial cursor position
                editor.focus();
                const body = editor.getBody();
                const firstChild = body.firstChild;
                if (firstChild) {
                  editor.selection.setCursorLocation(firstChild, 0);
                } else {
                  editor.selection.setCursorLocation(body, 0);
                }

                // Force white background
                const editorIframe = editorContainer.querySelector('iframe');
                if (editorIframe) {
                  const iframeDocument = editorIframe.contentDocument;
                  if (iframeDocument) {
                    iframeDocument.documentElement.style.backgroundColor = '#ffffff';
                  }
                }
              });
            },
            placeholder: 'Start writing your content...',
            forced_root_block: 'p',
            remove_trailing_brs: true,
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-8 text-lg text-muted-foreground">
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </div>
        {mode === 'analyze' && (
          <div className="flex gap-4">
            <Button
              onClick={onAnalyze}
              disabled={!hasContent}
              className="gap-3 px-8 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Wand2 className="h-7 w-7" />
              Analyze
            </Button>
          </div>
        )}
        {mode === 'create' && (
          <div className="flex gap-4">
            <Button
              onClick={onCreate}
              disabled={!hasContent}
              className="gap-3 px-8 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Wand2 className="h-7 w-7" />
              Verify
            </Button>
          </div>
        )}
        {mode === 'ai-score' && (
          <div className="flex gap-4">
            <Button
              onClick={onAIScore}
              disabled={!hasContent}
              className="gap-3 px-8 py-6 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Wand2 className="h-7 w-7" />
                Analyze
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentEditor;