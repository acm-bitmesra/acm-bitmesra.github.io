"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");
  const urlErrorDesc = searchParams.get("error_description");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    urlErrorDesc || (urlError ? `Authentication error: ${urlError}` : null)
  );

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
        errorCallbackURL: `/login?error=oauth_failed&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      });

      if (res?.error) {
        setError(res.error.message || "Failed to connect to Google OAuth. Please try again.");
        setLoading(false);
        return;
      }

      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
    } catch (err: unknown) {
      console.error("Sign-in failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to connect to Google OAuth. Please check your network and try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground px-4 py-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>acmbitm.campsy.app</span>
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SSO Gate</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md mx-auto w-full space-y-6 my-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-card border border-border text-primary shadow-xs">
            <AcmLogo className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to ACM BIT Mesra
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Developer portal, event registrations, verified student profiles & chapter resources.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting to Google Workspace...
                </span>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-card px-2 text-muted-foreground">Single Sign-On</span>
              </div>
            </div>
          </div>

          {/* Institutional Info Box */}
          <div className="rounded-lg bg-secondary/50 border border-border/80 p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-foreground uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Institutional Identity</span>
            </div>
            <ul className="space-y-1.5 text-muted-foreground leading-relaxed text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>BIT Mesra Students:</strong> Use your <code className="text-foreground">@bitmesra.ac.in</code> Google account for instant verification.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Chapter Executives & Editors:</strong> Roles and admin privileges map automatically based on chapter roster authorization.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-muted-foreground font-mono">
        ACM BIT Mesra · Student Chapter of Association for Computing Machinery
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}
