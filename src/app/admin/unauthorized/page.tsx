"use client";

import * as React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { ShieldAlert, ArrowLeft, LogOut, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminUnauthorizedPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      router.push("/admin/login");
    } catch (err) {
      console.error("Sign out error:", err);
      setSigningOut(false);
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
        <span className="font-mono text-[11px] text-red-500 uppercase tracking-widest flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Access Denied · 403
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-lg mx-auto w-full space-y-6">
        <div className="rounded-xl border border-red-900/40 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-500 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Chapter Access Not Authorized
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Authentication verified · Authorization check failed
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
            <p>
              Your Google identity is verified, but this email address is not registered in the active ACM BIT Mesra chapter roster.
            </p>

            <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-3.5 font-mono text-xs text-zinc-300 flex items-center justify-between">
              <span className="text-zinc-500">Authenticated Email:</span>
              <span className="font-semibold text-white truncate ml-2">
                {isPending ? "Loading..." : session?.user?.email || "Unknown"}
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              The editorial management portal is strictly limited to verified office bearers, SIG directors, and approved student writers.
            </p>
          </div>

          <div className="rounded-lg bg-zinc-900/40 border border-zinc-800/60 p-4 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-300 font-semibold uppercase">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              How to request chapter access
            </div>
            <p>
              If you are an active ACM BIT Mesra team member or contributor, reach out to the chapter President or Tech Head with your student roll number and appointed SIG role to have your account provisioned in the roster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{signingOut ? "Signing out..." : "Sign in with different account"}</span>
            </button>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs transition-colors text-center"
            >
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-zinc-600 font-mono">
        ACM BIT Mesra Security & Audit System
      </div>
    </div>
  );
}
