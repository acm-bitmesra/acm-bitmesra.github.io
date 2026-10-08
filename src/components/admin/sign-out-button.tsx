"use client";

import * as React from "react";
import { authClient } from "@/lib/auth/auth-client";
import { LogOut } from "@animateicons/react/lucide";
import { useRouter } from "next/navigation";

export function AdminSignOutButton() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors disabled:opacity-50 cursor-pointer"
      title="Sign Out of Admin Console"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{loading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
