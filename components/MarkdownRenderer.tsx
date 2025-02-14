import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const renderers = {
  h1: ({ children }: any) => (
    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl font-bold text-gray-800 mb-1">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg font-bold text-gray-700 mb-1">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-gray-700 leading-normal">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc ml-6 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal ml-6 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="ml-4">{children}</li>
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto max-h-[70vh] prose prose-lg max-w-none text-gray-800 leading-relaxed">
      <ReactMarkdown 
        components={renderers} 
        remarkPlugins={[remarkGfm]}
      >
        {content.replace(/\n/g, "\n\n")}
      </ReactMarkdown>
    </div>
  );
}

export function convertMarkdownToPlainText(markdown: string): string {
  if (!markdown) return '';

  let plainText = markdown;

  // Preserve header hierarchy
  plainText = plainText.replace(/^# (.*)/gm, '--- $1 ---');
  plainText = plainText.replace(/^## (.*)/gm, '-- $1 --');
  plainText = plainText.replace(/^### (.*)/gm, '- $1 -');

  // Convert bold and italic
  plainText = plainText.replace(/(\*\*|__)(.*?)\1/g, '$2 (bold)');
  plainText = plainText.replace(/(\*|_)(.*?)\1/g, '$2 (italic)');

  // Convert links
  plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1 (link)');

  // Handle lists
  plainText = plainText.replace(/^[-*+]\s*(.*)$/gm, '• $1');
  plainText = plainText.replace(/^\d+\.\s*(.*)$/gm, '1. $1');

  // Remove code blocks
  plainText = plainText.replace(/```[\s\S]*?```/g, '[Code Block]');
  plainText = plainText.replace(/`([^`]+)`/g, '[$1]');

  // Trim multiple newlines
  plainText = plainText.replace(/\n{3,}/g, '\n\n');

  return plainText.trim();
}

export function getDownloadableContent(content: string, format: 'docx' | 'pdf' = 'docx') {
  const plainText = convertMarkdownToPlainText(content);
  
  if (format === 'pdf') {
    return plainText;
  }
  
  // For DOCX, we'll preserve some basic formatting
  return content.split('\n').map(line => {
    // Handle headers
    if (line.startsWith('# ')) return line.replace('# ', '').toUpperCase();
    if (line.startsWith('## ')) return line.replace('## ', '');
    return line;
  }).join('\n');
}