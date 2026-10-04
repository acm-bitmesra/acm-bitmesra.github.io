"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  FileText,
  UserPlus,
  Image,
  Home,
  ShieldAlert,
  Activity,
  Settings,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  Command,
  X,
} from "lucide-react";

interface AdminCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: "ACTIONS" | "NAVIGATION" | "SYSTEM";
  icon: React.ElementType;
  href?: string;
  shortcut?: string;
  action?: () => void;
}

const COMMANDS: CommandItem[] = [
  // Quick Actions
  {
    id: "create-article",
    label: "Create Article",
    category: "ACTIONS",
    icon: FileText,
    href: "/admin/blog/new",
    shortcut: "N",
  },
    {
      id: "create-event",
      label: "Create Event",
      category: "ACTIONS",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      id: "add-member",
      label: "Add Chapter Member",
      category: "ACTIONS",
      icon: UserPlus,
      href: "/admin/members",
    },
    {
      id: "upload-media",
      label: "Upload Media / Photos",
      category: "ACTIONS",
      icon: Image,
      href: "/admin/media",
    },
    {
      id: "edit-homepage",
      label: "Edit Homepage",
      category: "ACTIONS",
      icon: Home,
      href: "/admin/homepage",
    },

    // Navigation
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      category: "NAVIGATION",
      icon: Sparkles,
      href: "/admin/dashboard",
    },
    {
      id: "nav-articles",
      label: "Browse Articles CMS",
      category: "NAVIGATION",
      icon: FileText,
      href: "/admin/blog",
    },
    {
      id: "nav-events",
      label: "Browse Events & Contests",
      category: "NAVIGATION",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      id: "nav-team",
      label: "Manage Executive Team",
      category: "NAVIGATION",
      icon: Users,
      href: "/admin/team",
    },
    {
      id: "nav-sponsors",
      label: "Manage Sponsors & Partners",
      category: "NAVIGATION",
      icon: Award,
      href: "/admin/sponsors",
    },
    {
      id: "nav-gallery",
      label: "Manage Photo Gallery",
      category: "NAVIGATION",
      icon: Image,
      href: "/admin/gallery",
    },

    // System & Governance
    {
      id: "open-security",
      label: "Open Security Platform",
      category: "SYSTEM",
      icon: ShieldAlert,
      href: "/admin/security",
    },
    {
      id: "open-audit",
      label: "Open Audit Logs",
      category: "SYSTEM",
      icon: Activity,
      href: "/admin/audit",
    },
    {
      id: "open-settings",
      label: "Open Settings",
      category: "SYSTEM",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      id: "view-website",
      label: "View Live Public Website",
      category: "SYSTEM",
      icon: ExternalLink,
      action: () => window.open("/", "_blank"),
    },
  ];

export function AdminCommandPalette({
  open,
  onOpenChange,
}: AdminCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global Keyboard listener for Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const handleSelect = (item: CommandItem) => {
    onOpenChange(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-zinc-800 gap-3">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or search sections..."
            className="w-full h-12 bg-transparent text-sm font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close command palette"
            className="h-7 w-7 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-zinc-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-mono transition-colors ${
                    isSelected
                      ? "bg-zinc-800/90 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-red-500" : "text-zinc-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px] text-zinc-500">
                    <span className="uppercase tracking-wider">{item.category}</span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-400 font-mono">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>Use ↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
