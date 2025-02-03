'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/user/appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

interface ValidationError {
  field: string;
  message: string;
}

export default function Login() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (email: string, password: string) => {
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    if (password.length < 6) {
      return { field: 'password', message: 'Password must be at least 6 characters' };
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validationError = validateForm(email, password);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const session = await login(email, password);
      localStorage.setItem('sessionToken', session.secret);
      router.push('/dashboard');
    } catch (error) {
      setError({
        field: 'general',
        message: 'Invalid email or password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Welcome Back!</h3>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label 
            htmlFor="email" 
            className={`block text-sm font-medium ${error?.field === 'email' ? 'text-red-500' : 'text-gray-700'}`}
          >
            Email Address
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="your@email.com"
              className={`pl-10 ${error?.field === 'email' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'email' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Label 
            htmlFor="password"
            className={`block text-sm font-medium ${error?.field === 'password' ? 'text-red-500' : 'text-gray-700'}`}
          >
            Password
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className={`pl-10 ${error?.field === 'password' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'password' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error?.field === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}