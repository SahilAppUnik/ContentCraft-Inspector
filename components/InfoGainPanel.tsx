import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

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

const InfoGainPanel: React.FC<InfoGainPanelProps> = ({ content, triggerInfoGain }) => {
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
    // This is a simple implementation. You might want to use a more sophisticated method
    // to extract the main topic, such as natural language processing or keyword extraction.
    const words = text.split(/\s+/);
    return words.slice(0, 3).join(' '); // Take the first three words as the main topic
  };

  const fetchInfoGain = async (topic: string) => {
    console.log('topic', topic);

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
    <div className="h-full overflow-hidden flex flex-col">
      <motion.div
        className="flex-1 overflow-y-auto pr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-[#171717] border-b border-[#2a2a2a] sticky top-0 z-10 p-4">
            <CardTitle className="flex items-center text-xl text-white">
              <Search className="mr-2 h-5 w-5" />
              Knowledge Expansion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-[#0d0d0d]">
            <motion.div
              className="flex space-x-2 mb-6 sticky top-[72px] z-10 bg-[#0d0d0d] pt-2 pb-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex-1 flex">
                <div className="relative flex-1 flex items-center">
                  <Input
                    type="text"
                    placeholder="Search for more information..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-4 pr-12 bg-[#171717] border-0 rounded-l-full focus:ring-0 focus:outline-none text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleSearch}
                    className="h-10 px-6 rounded-r-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 focus:outline-none"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>
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
                    className="p-4 bg-[#171717] rounded-lg border border-border"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-foreground">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">{tavilyData.answer}</p>
                  </motion.div>
                )}

                {tavilyData.relatedQueries?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 sticky top-[140px] bg-[#0d0d0d] pt-2 pb-1 z-10 text-foreground">
                      Related Questions
                    </h3>
                    <ul className="space-y-3">
                      {tavilyData.relatedQueries.map((query, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center text-sm p-3 rounded-lg bg-[#171717] border border-border"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                          <span className="text-muted-foreground">{query}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {tavilyData.results?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 sticky top-[140px] bg-[#0d0d0d] pt-2 pb-1 z-10 text-foreground">
                      Related Links
                    </h3>
                    <ul className="space-y-3">
                      {tavilyData.results.map((item, index) => (
                        <motion.li
                          key={index}
                          className="bg-[#171717] border border-border rounded-lg overflow-hidden"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:bg-[#1f1f1f] transition duration-300 ease-in-out p-4"
                          >
                            <motion.h4
                              className="text-lg font-semibold text-blue-400 flex items-center"
                              whileHover={{ x: 5 }}
                            >
                              {item.title}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </motion.h4>
                            <p className="text-sm text-muted-foreground mt-2">
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
  );
};

export default InfoGainPanel;