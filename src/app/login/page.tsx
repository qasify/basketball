'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authDB } from '@/_api/firebase-api';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/lib/notify';
import { toastMessage } from '@/utils/constants/toastMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authDB.login(email, password);
      // No need to store in localStorage, Firebase handles the session
    } catch {
      const msg = toastMessage.auth.invalidCredentials;
      setError(msg);
      notify.error(toastMessage.auth.signInFailedTitle, { description: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Optional page-level glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purpleFill blur-[150px] opacity-20 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary blur-[150px] opacity-10 rounded-full" />

      <div className="max-w-md w-full backdrop-blur-[10px] bg-tileBackground border border-borderLight p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-textGrey text-sm">Sign in to access your dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
              <div className="text-sm text-red-400 text-center">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="text-sm font-medium text-white mb-1 block">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purpleFill focus:border-transparent transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-white mb-1 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purpleFill focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-semibold bg-nav-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purpleFill focus:ring-offset-background transition-all"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/signup" className="text-textGrey hover:text-white transition-colors">
            Don&apos;t have an account? <span className="text-purpleFill font-semibold">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 