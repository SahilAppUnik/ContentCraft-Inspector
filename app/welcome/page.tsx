'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles } from 'lucide-react';
import Head from 'next/head'; // Import next/head

export default function Welcome() {
  const router = useRouter();

  return (
    <>
      {/* Meta information for SEO */}
      <Head>
        <title>Welcome to ContentCraft-Inspector</title>
        <meta
          name="description"
          content="Content creation with ContentCraft-Inspector's AI platform. Create, analyze, and optimize content with smart editing tools and deep insights. Try it free today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl w-full">
          {/* Logo and Title Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <Sparkles className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ContentCraft-Inspector
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your all-in-one platform for creating, analyzing, and optimizing content with the power of AI
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">Generate high-quality content with advanced AI technology</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Edit className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Editor</h3>
              <p className="text-gray-600">Create and edit content with powerful tools</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Deep Analysis</h3>
              <p className="text-gray-600">Get detailed insights and content optimization tips</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <button
              onClick={() => router.push('/auth/signup')}
              className={`bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold 
               hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200
               shadow-lg hover:shadow-xl`}
            >
              Get Started - It&apos;s Free
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className={`bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold
               hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200
               shadow-lg hover:shadow-xl border border-gray-200`}
            >
              Sign In
            </button>
          </motion.div>
        </div>

        {/* Add animation keyframes in style tag */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </>
  );
}