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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="cool-card overflow-hidden mb-6">
        <CardHeader className="bg-blue-500 text-primary-foreground">
          <CardTitle className="flex items-center text-2xl">
            <Search className="mr-2" />
            Knowledge Expansion
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div
            className="flex space-x-2 mb-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Search for more information..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cool-input"
            />
            <Button onClick={handleSearch} className="cool-button">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </motion.div>
          {isLoading ? (
            <p>Loading...</p>
          ) : tavilyData ? (
            <>
              {tavilyData.answer && (
                <motion.div
                  className="mb-6 p-4 bg-primary/10 rounded-lg"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Summary
                  </h3>
                  <p className="text-sm">{tavilyData.answer}</p>
                </motion.div>
              )}
              {tavilyData.relatedQueries &&
                tavilyData.relatedQueries.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Related Questions
                    </h3>
                    <ul className="space-y-4 mb-6">
                      {tavilyData.relatedQueries.map((query, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center text-sm bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-2 rounded-lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                          {query}
                        </motion.li>
                      ))}
                    </ul>
                  </>
                )}
              {tavilyData.results && tavilyData.results.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Related Links</h3>
                  <ul className="space-y-4">
                    {tavilyData.results.map((item, index) => (
                      <motion.li
                        key={index}
                        className="border-b border-border pb-4 last:border-b-0"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:bg-gradient-to-r hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 transition duration-300 ease-in-out rounded-md p-2"
                        >
                          <motion.h4
                            className="text-lg font-semibold text-primary flex items-center"
                            whileHover={{ x: 5 }}
                          >
                            {item.title}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </motion.h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.content}
                          </p>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InfoGainPanel;