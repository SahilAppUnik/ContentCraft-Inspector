import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import router from 'next/router';
import { getUser } from '@/lib/user/appwrite';

interface InfoGainPanelProps {
  content: string;
  triggerInfoGain: boolean;
}

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyData {
  answer: string;
  results: SearchResult[];
  relatedQueries: string[];
}

const InfoGainPanel: React.FC<InfoGainPanelProps> = ({
  content,
  triggerInfoGain,
}) => {
  const [tavilyData, setTavilyData] = useState<TavilyData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content && triggerInfoGain) {
      const mainTopic = extractMainTopic(content);
      fetchInfoGain(mainTopic);
    }
  }, [content, triggerInfoGain]);

  const extractMainTopic = (text: string): string => {
    const words = text.split(/\s+/);
    return words.slice(0, 10).join(' ');
  };

  const fetchInfoGain = async (topic: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/infogain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setTavilyData(data);

      const documentId = localStorage.getItem('documentId')
          if (documentId) {
            await updateContent(documentId, {
              input: content,
              analysis: content,
              summary: data.answer,
              relatedLinks: data.results
            })
          } else {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
              router.push('/auth/login');
              throw new Error('No session found');
            }
            const user = await getUser(sessionToken)
            const res = await saveContent(content, user.$id, content, 'analyze', data.answer, data.results)

            localStorage.setItem('documentId', res.$id);
          }
    } catch (error) {
      console.error('Error fetching InfoGain results:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (searchTerm) {
      fetchInfoGain(searchTerm);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          <motion.div
            className="flex-1 overflow-y-auto custom-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Search className="mr-2 h-5 w-5" />
                  Knowledge Expansion
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <motion.div
                  className="flex items-center mb-6 sticky top-[72px] z-10 bg-white pt-2 pb-4"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative flex w-full max-w-lg">
                    {/* Search Input */}
                    <Input
                      type="text"
                      placeholder="Search for more information..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 h-18 px-4 bg-white border border-gray-300 rounded-l-full"
                    />

                    {/* Search Button */}
                    <Button
                      onClick={handleSearch}
                      className="h-12 px-6 rounded-r-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </Button>
                  </div>
                </motion.div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      className="w-8 h-8 border-t-2 border-blue-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                ) : tavilyData ? (
                  <div className="space-y-6">
                    {tavilyData.answer && (
                      <motion.div
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Summary
                        </h3>
                        <p className="text-sm text-gray-700">{tavilyData.answer}</p>
                      </motion.div>
                    )}

                    {tavilyData.relatedQueries?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 sticky top-[140px] bg-white pt-2 pb-1 z-10 text-gray-900">
                          Related Questions
                        </h3>
                        <ul className="space-y-3">
                          {tavilyData.relatedQueries.map((query, index) => (
                            <motion.li
                              key={index}
                              className="flex items-center text-sm p-3 rounded-lg bg-gray-50 border border-gray-200"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                              <span className="text-gray-700">{query}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tavilyData.results?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 sticky top-[140px] bg-white pt-2 pb-1 z-10 text-gray-900">
                          Related Links
                        </h3>
                        <ul className="space-y-3">
                          {tavilyData.results.map((item, index) => (
                            <motion.li
                              key={index}
                              className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:bg-gray-100 transition duration-300 ease-in-out p-4"
                              >
                                <motion.h4
                                  className="text-lg font-semibold text-blue-600 flex items-center"
                                  whileHover={{ x: 5 }}
                                >
                                  {item.title}
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </motion.h4>
                                <p className="text-sm text-gray-700 mt-2">
                                  {item.content}
                                </p>
                              </a>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InfoGainPanel;