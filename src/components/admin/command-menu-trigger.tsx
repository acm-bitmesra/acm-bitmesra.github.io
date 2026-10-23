"use client";

import { Zap } from "lucide-react";

export function CommandMenuTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          }),
        );
      }}
      className="hidden items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 sm:inline-flex cursor-pointer"
    >
      <Zap className="h-3 w-3" />
      Command menu
      <kbd className="rounded border border-zinc-800 bg-zinc-950 px-1 text-[9px]">⌘K</kbd>
    </button>
  );
}
