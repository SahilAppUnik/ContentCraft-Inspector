'use client';

import { useEffect, useState } from 'react';
import { getUser, logout, updateUserName } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Edit } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; $id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          throw new Error('No session found');
        }

        const userData = await getUser(sessionToken);
        setUser(userData);
        setNewName(userData.name); // Set initial name value
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      setUpdating(true);
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        throw new Error('No session token found.');
      }

      const updatedUser = await updateUserName(sessionToken, newName);
      setUser(updatedUser);
      setEditing(false); // Disable edit mode after saving
    } catch (error) {
      console.error('Name update failed:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-xl w-96">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">User Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-lg"><strong>Name:</strong></p>
            {editing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 w-full"
              />
            ) : (
              <p className="text-lg">{user.name}</p>
            )}
            <button
              onClick={() => setEditing(!editing)}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-all"
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>

          {editing && (
            <Button
              onClick={handleUpdateName}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              {updating ? 'Updating...' : 'Save'}
            </Button>
          )}

          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-all"
          >
            <LogOut className="h-5 w-5" />
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
