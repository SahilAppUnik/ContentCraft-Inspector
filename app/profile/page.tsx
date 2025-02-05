'use client';

import { useEffect, useState } from 'react';
import { getUser, logout, updateUserName } from '@/lib/user/appwrite';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Edit, 
  Check, 
  X, 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; $id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [memberSince, setMemberSince] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          throw new Error('No session found');
        }

        const userData = await getUser(sessionToken);
        setUser(userData);
        setNewName(userData.name);
        setMemberSince(formatDate(userData.$createdAt));
      } catch (error) {
        console.error('Profile fetch failed:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };    

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await logout(sessionToken);
        localStorage.removeItem('sessionToken');
      }
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        throw new Error('No session token found.');
      }

      const updatedUser = await updateUserName(sessionToken, newName);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Name update failed:', error);
      setError('Failed to update name. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setNewName(user?.name || '');
    setError(null);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
            >
              <LogOut className="h-5 w-5" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Name Edit Section */}
            <div className="space-y-4">
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    Display Name
                  </h3>
                  {!editing && (
                    <Button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-4 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your name"
                      />

                      {error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-sm flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.p>
                      )}

                      <div className="flex items-center gap-4">
                        <Button
                          onClick={handleUpdateName}
                          disabled={updating}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                        >
                          {updating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          disabled={updating}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg text-gray-700"
                    >
                      {user?.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Account Security</h3>
                  <p className="text-sm text-gray-500">Your account is secure</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Member Since</h3>
                  <p className="text-sm text-gray-500">{memberSince}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}