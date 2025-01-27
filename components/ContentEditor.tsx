// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import 'quill/dist/quill.snow.css';
// import { Button } from './ui/button';
// import { Zap } from 'lucide-react';

// // Dynamically import ReactQuill to avoid SSR issues
// const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// interface ContentEditorProps {
//   initialContent?: string;
//   onAnalyze: (content: string) => void;
// }

// export function ContentEditor({ initialContent = '', onAnalyze }: ContentEditorProps) {
//   const [content, setContent] = useState(initialContent);
//   const [charCount, setCharCount] = useState(0);
//   const [wordCount, setWordCount] = useState(0);

//   // Use `useRef` for managing Quill instance
//   const quillRef = useRef<any>(null);

//   // Update content when `initialContent` changes
//   useEffect(() => {
//     setContent(initialContent);
//   }, [initialContent]);

//   // Update word and character count when content changes
//   useEffect(() => {
//     const plainText = content.replace(/<\/?[^>]+(>|$)/g, '').trim();
//     setCharCount(plainText.length);
//     setWordCount(plainText.split(/\s+/).filter(Boolean).length);
//   }, [content]);

//   const handleAnalyze = () => {
//     onAnalyze(content);
//   };

//   // Define Quill modules and formats
//   const formats = [
//     'header',
//     'font',
//     'size',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'indent',
//     'link',
//     'image',
//     'color',
//     'background',
//   ];

//   const modules = {
//     toolbar: [
//       [{ header: '1' }, { header: '2' }, { font: [] }],
//       [{ size: [] }],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//       ['link', 'image'],
//       [{ color: [] }, { background: [] }],
//       ['clean'],
//     ],
//   };

//   // Access the Quill editor instance when needed
//   const getEditorInstance = () => {
//     if (quillRef.current) {
//       return quillRef.current.getEditor(); // Get the Quill editor instance
//     }
//     return null;
//   };

//   return (
//     <div className="h-full flex flex-col gap-6 p-6">
//       <div className="flex-1 relative border rounded-lg overflow-hidden bg-background">
//         <ReactQuill
//           ref={quillRef} // Attach the ref properly
//           value={content}
//           onChange={setContent}
//           modules={modules}
//           formats={formats}
//           className="h-[calc(100%-60px)] text-lg"
//           placeholder="Start writing your content..."
//         />
//       </div>
//       <div className="flex justify-between items-center">
//         <div className="flex space-x-8 text-lg text-muted-foreground">
//           <span>Characters: {charCount}</span>
//           <span>Words: {wordCount}</span>
//         </div>
//         <Button
//           onClick={handleAnalyze}
//           disabled={!content.trim()}
//           className="gap-3 px-8 py-6 text-lg rounded-xl"
//           size="lg"
//         >
//           <Zap className="h-6 w-6" />
//           Analyze
//         </Button>
//       </div>
//     </div>
//   );
// }
