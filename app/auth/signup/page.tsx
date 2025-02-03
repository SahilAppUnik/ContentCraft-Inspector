'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signup } from '@/lib/user/appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, User, Mail, Lock, Check } from 'lucide-react';
import Link from 'next/link';

interface ValidationError {
  field: string;
  message: string;
}

export default function Signup() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateForm = (name: string, email: string, password: string) => {
    if (name.length < 2) {
      return { field: 'name', message: 'Name must be at least 2 characters long' };
    }
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    if (password.length < 6) {
      return { field: 'password', message: 'Password must be at least 6 characters' };
    }
    return null;
  };

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validationError = validateForm(name, email, password);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const session = await signup(email, password, name);
      localStorage.setItem('sessionToken', session.secret);
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('already exists')) {
        setError({ field: 'email', message: 'This email is already registered' });
      } else {
        setError({
          field: 'general',
          message: 'Failed to create account. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength(password);
    const bars = [];
    for (let i = 0; i < 4; i++) {
      bars.push(
        <div
          key={i}
          className={`h-1 w-full rounded-full transition-colors duration-300 ${
            i < strength 
              ? strength === 1 ? 'bg-red-500' 
              : strength === 2 ? 'bg-yellow-500'
              : strength === 3 ? 'bg-blue-500'
              : 'bg-green-500'
              : 'bg-gray-200'
          }`}
        />
      );
    }
    return (
      <div className="space-y-2">
        <div className="flex gap-1">{bars}</div>
        <p className="text-xs text-gray-500">
          {strength === 0 && 'Enter password'}
          {strength === 1 && 'Weak password'}
          {strength === 2 && 'Fair password'}
          {strength === 3 && 'Good password'}
          {strength === 4 && 'Strong password'}
        </p>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Create Account</h3>
        <p className="text-sm text-gray-500 mt-1">Join us and start creating amazing content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div>
          <Label 
            htmlFor="name" 
            className={`block text-sm font-medium ${error?.field === 'name' ? 'text-red-500' : 'text-gray-700'}`}
          >
            Full Name
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className={`pl-10 ${error?.field === 'name' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'name' && (
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

        {/* Email Field */}
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

        {/* Password Field */}
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
              required
              placeholder="••••••••"
              className={`pl-10 ${error?.field === 'password' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-2">
            {renderPasswordStrength()}
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

        {/* General Error Message */}
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}