'use client';

import { motion } from 'framer-motion';
import { Edit, FileSearch, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleModeChange = (mode: string) => {
    router.push(`/dashboard?mode=${mode}`);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to ContentCraft Inspector
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your all-in-one platform for content creation, analysis, and optimization
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Generate with AI Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => handleModeChange('ai-generate')}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 cursor-pointer 
                     hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
              <Wand2 className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generate with AI</h2>
            <p className="text-gray-600">
              Create high-quality content instantly using our advanced AI technology
            </p>
          </div>
        </motion.div>

        {/* Create Content Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => handleModeChange('create')}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 cursor-pointer 
                     hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <Edit className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Content</h2>
            <p className="text-gray-600">
              Write and edit your content with our powerful editor tools
            </p>
          </div>
        </motion.div>

        {/* Analyze Content Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => handleModeChange('analyze')}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 cursor-pointer 
                     hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-6">
              <FileSearch className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analyze Content</h2>
            <p className="text-gray-600">
              Get detailed insights and analysis of your content
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}