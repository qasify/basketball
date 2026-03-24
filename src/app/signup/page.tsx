"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authDB } from "@/_api/firebase-api";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await authDB.register(email, password);
    } catch {
      setError("Failed to create account. Email might be already in use.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Optional page-level glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purpleFill blur-[150px] opacity-20 rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary blur-[150px] opacity-10 rounded-full" />

      <div className="max-w-md w-full backdrop-blur-[10px] bg-tileBackground border border-borderLight p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Create your account
          </h2>
          <p className="text-textGrey text-sm">Join to explore player databases</p>
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
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purpleFill focus:border-transparent transition-all"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-sm font-medium text-white mb-1 block">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purpleFill focus:border-transparent transition-all"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-semibold bg-nav-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purpleFill focus:ring-offset-background transition-all"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-textGrey hover:text-white transition-colors"
          >
            Already have an account? <span className="text-purpleFill font-semibold">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
