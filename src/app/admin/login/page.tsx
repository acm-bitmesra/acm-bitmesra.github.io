"use client";

import * as React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { ShieldCheck, Lock, ArrowLeft, Terminal, AlertCircle } from "lucide-react";

import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const urlErrorDesc = searchParams.get("error_description");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    urlErrorDesc || (urlError ? `Sign-in error: ${urlError}` : null)
  );

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin",
        errorCallbackURL: "/admin/unauthorized",
      });
    } catch (err: unknown) {
      console.error("Sign-in failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign-in. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#080808] text-foreground px-4 py-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>acmbitm.campsy.app</span>
        </Link>
        <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Production Console
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 text-primary shadow-inner">
            <Lock className="h-6 w-6 text-[#E31B23]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ACM BIT Mesra Console
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Editorial publication, article reviews & chapter records
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-2xl">
          <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/80 p-3.5 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300 font-semibold uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E31B23]" />
              Restricted Allowlist Authentication
            </div>
            <p className="leading-relaxed text-[11px]">
              Access is strictly limited to authorized chapter executives, editors, and verified student contributors registered in the ACM chapter roster.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/30 border border-red-800/40 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-100 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                Connecting to Google OAuth...
              </span>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Chapter Google Account</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-zinc-500 font-mono flex items-center justify-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-zinc-600" />
            <span>Role-Based Access Control · Server-side Guard</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-zinc-600 font-mono">
        ACM Student Chapter, BIT Mesra · Ranchi, Jharkhand 835215
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <LoginForm />
    </React.Suspense>
  );
}
