'use client';

import { fetchHistory, deleteHistoryItem } from "@/lib/content/appwrite";
import { getUser } from "@/lib/user/appwrite";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistoryItem {
  $id: string;
  userId: string;
  content: string;
  analysis?: string;
  createdAt: string;
  updatedAt: string;
  mode: 'ai-generate' | 'create' | 'analyze' | 'ai-score';
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ $id: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          router.push('/auth/login');
          throw new Error('No session found');
        }

        const userData = await getUser(sessionToken);
        setUser(userData);

        if (userData.$id) {
          const historyData = await fetchHistory(userData.$id, currentPage, ITEMS_PER_PAGE);
          setHistory(historyData?.documents || []);
          setTotalPages(Math.ceil((historyData?.total || 0) / ITEMS_PER_PAGE));
        }
      } catch (error) {
        console.error('Profile or history fetch failed:', error);
        setError('Failed to load your profile or history. Please try again.');
        if ((error as Error).message === 'No session found') {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, currentPage]);

  const handleViewDetails = (item: HistoryItem) => {
    const query = {
      mode: item.mode,
      content: item.content,
      documentId: item.$id,
      fromHistory: true,
      analysis: item.analysis
    };

    localStorage.setItem('dashboardState', JSON.stringify(query));
    router.push('/dashboard');
  };

  const handleDelete = async (documentId: string) => {
    setItemToDelete(documentId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteHistoryItem(itemToDelete);
      const historyData = await fetchHistory(user?.$id || '', currentPage, ITEMS_PER_PAGE);
      setHistory(historyData?.documents || []);
      setTotalPages(Math.ceil((historyData?.total || 0) / ITEMS_PER_PAGE));

      // If current page is empty and not the first page, go to previous page
      if (historyData.documents.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete item. Please try again.');
    } finally {
      setShowDeleteAlert(false);
      setItemToDelete(null);
    }
  };

  const getModeColor = (mode: HistoryItem['mode']) => {
    const colors = {
      'ai-generate': 'bg-blue-100 text-blue-800',
      'create': 'bg-green-100 text-green-800',
      'analyze': 'bg-purple-100 text-purple-800',
      'ai-score': 'bg-orange-100 text-orange-800'
    };
    return colors[mode];
  };

  const getModeLabel = (mode: HistoryItem['mode']) => {
    const labels = {
      'ai-generate': 'AI Generated',
      'create': 'Created',
      'analyze': 'Analyzed',
      'ai-score': 'AI Scored'
    };
    return labels[mode];
  };

  const handleBack = () => {
    localStorage.setItem('skipWelcome', 'true');
    router.push('/dashboard');
  };

  if (!user && !loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">Please log in to view your history.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-semibold">History</h2>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : history.length > 0 ? (
          <>
            <ul className="space-y-4">
              {history.map((item) => (
                <li
                  key={item.$id}
                  className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getModeColor(item.mode)}>
                        {getModeLabel(item.mode)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.$id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="prose max-w-none line-clamp-3 mb-3" dangerouslySetInnerHTML={{ __html: item.content }} />

                  {item.analysis && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 font-medium">Analysis Summary:</p>
                      <div className="text-sm text-gray-500 line-clamp-2">{item.analysis}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      {item.updatedAt !== item.createdAt &&
                        `Updated: ${new Date(item.updatedAt).toLocaleString()}`
                      }
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => handleViewDetails(item)}
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No history found.</p>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <DialogTitle>Content Details</DialogTitle>
                {selectedItem && (
                  <Badge className={`mt-2 ${getModeColor(selectedItem.mode)}`}>
                    {getModeLabel(selectedItem.mode)}
                  </Badge>
                )}
              </div>
            </div>
            {selectedItem && (
              <div className="space-y-1 text-sm text-gray-500">
                <p>Created: {new Date(selectedItem.createdAt).toLocaleString()}</p>
                {selectedItem.updatedAt !== selectedItem.createdAt && (
                  <p>Updated: {new Date(selectedItem.updatedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-auto mt-4">
            {selectedItem && (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Input</h3>
                  <div
                    className="rounded-lg bg-white"
                    dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                  />
                </div>

                {selectedItem.analysis && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      {selectedItem.analysis}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this content from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}