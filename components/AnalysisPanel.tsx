'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Type, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { saveContent, updateContent } from '@/lib/content/appwrite'
import { getUser } from '@/lib/user/appwrite'
import router from 'next/router'

interface AnalysisPanelProps {
  content: string
  triggerAnalysis: boolean
}

interface AnalysisResult {
  contentScore: number
  readability: number
  tone: string
  keyInsights: string[]
  improvements: string[]
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  content,
  triggerAnalysis,
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const words = content.split(/\s+/).filter(Boolean)
    setWordCount(words.length)
    setReadingTime(Math.ceil(words.length / 150)) // Assuming 150 words per minute
  }, [content])

  useEffect(() => {
    const analyzeContent = async () => {
      if (content.trim().length > 0 && triggerAnalysis) {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          })

          if (!response.ok) {
            throw new Error('Failed to analyze content')
          }

          const result = await response.json()

          setAnalysis({
            contentScore: result.contentScore || 0,
            readability: result.readability || 0,
            tone: result.tone || 'neutral',
            keyInsights: result.keyInsights || [],
            improvements: result.improvements || [],
          })

          const documentId = localStorage.getItem('documentId')
          if (documentId) {
            await updateContent(documentId, {
              input: content,
              analysis: content,
              contentScore: result.contentScore,
              readability: result.readability,
              tone: result.tone,
              keyInsights: result.keyInsights,
              improvements: result.improvements,
              wordCount: wordCount,
              readingTime: readingTime
            })
          } else {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
              router.push('/auth/login');
              throw new Error('No session found');
            }
            const user = await getUser(sessionToken)
            const res = await saveContent(content, user.$id, content, 'analyze', result.contentScore, result.readability, result.tone, result.keyInsights, result.improvements, wordCount, readingTime)
            localStorage.setItem('documentId', res.$id);
          }
        } catch (error) {
          console.error('Error analyzing content:', error)
          setError(
            "I'm sorry, but the content provided is incomplete. Please provide more information or the full content to proceed with the analysis"
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        setAnalysis(null)
      }
    }

    analyzeContent()
  }, [content, triggerAnalysis])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Analyze Content</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the &quot;Analyze&quot; button to get a analysis of your
            content.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          <motion.div
            className="flex-1 overflow-y-auto p-6 space-y-6 pr-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #f3f4f6',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Zap className="mr-2 text-blue-600" />
                  Content Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  <motion.div
                    className="relative w-48 h-48"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Define the gradient */}
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: '#3b82f6', stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: '#60a5fa', stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>

                      {/* Background circle */}
                      <circle
                        className="text-gray-200"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeWidth="8"
                        stroke="currentColor"
                      />

                      {/* Score circle */}
                      <motion.circle
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        transform="rotate(-90 50 50)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: analysis.contentScore / 100 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </svg>

                    {/* Score text */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {Math.round(analysis.contentScore)}
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard icon={<Type />} label="Word Count" value={wordCount} />
              <MetricCard
                icon={<Clock />}
                label="Reading Time"
                value={`${readingTime} min`}
              />
              <MetricCard
                icon={<Type />}
                label="Readability"
                value={`${Math.round(analysis.readability)}%`}
              />
              <MetricCard
                icon={<AlertCircle />}
                label="Tone"
                value={analysis.tone}
              />
            </div>

            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <AlertCircle className="mr-2 text-blue-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {analysis.keyInsights.map((insight, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-base border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Zap className="mr-2 text-blue-600" />
                  Suggested Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {analysis.improvements.map((improvement, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-base border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{improvement}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const MetricCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: number | string
}> = ({ icon, label, value }) => (
  <motion.div
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
  >
    <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-white border-b border-gray-100 p-2">
        <CardTitle className="flex items-center text-lg text-gray-900">
          {icon}
          <span className="ml-2">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{value}</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default AnalysisPanel