'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await account.createSession(email, password);
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
      } else {
        await account.create(ID.unique(), email, password);
        await account.createSession(email, password);
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
      }
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </motion.div>
  );
}