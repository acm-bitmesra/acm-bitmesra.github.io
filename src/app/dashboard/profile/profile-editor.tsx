"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Globe,
  ExternalLink,
  CheckCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  BookOpen,
  Code2,
  Sparkles,
  FolderGit2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import type { PinnedProject, PersonalBlogPost, ProfileCustomSettings } from "@/db/schema/students";

interface Batch {
  id: string;
  label: string;
  endYear: number;
}

interface ProfileData {
  slug?: string | null;
  displayName?: string | null;
  bio?: string | null;
  academicProgram?: string | null;
  department?: string | null;
  batchId?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  theme?: string | null;
  isPublic?: boolean | null;
  portfolioBlocks?: Array<{
    type: string;
    title?: string;
    content?: unknown;
  }>;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  handle: string;
  profileUrl: string;
  isVerified: boolean;
}

interface ProfileEditorProps {
  initialProfile?: ProfileData | null;
  initialAccounts?: ConnectedAccount[];
  batches: Batch[];
  userEmail: string;
}

export function ProfileEditor({
  initialProfile,
  initialAccounts = [],
  batches,
  userEmail,
}: ProfileEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"identity" | "accounts" | "projects" | "blogs" | "theme">("identity");

  // Initial block parsing
  const initialBlocks = initialProfile?.portfolioBlocks || [];
  const projectsBlock = initialBlocks.find((b) => b.type === "projects");
  const blogsBlock = initialBlocks.find((b) => b.type === "blogs");
  const settingsBlock = initialBlocks.find((b) => b.type === "settings");
  const initialSettings = (settingsBlock?.content || {}) as ProfileCustomSettings;

  // Basic Profile State
  const [slug, setSlug] = React.useState(initialProfile?.slug || "");
  const [displayName, setDisplayName] = React.useState(initialProfile?.displayName || "");
  const [bio, setBio] = React.useState(initialProfile?.bio || "");
  const [department, setDepartment] = React.useState(
    initialProfile?.department || "Computer Science & Engineering"
  );
  const [batchId, setBatchId] = React.useState(initialProfile?.batchId || "");
  const [skillsInput, setSkillsInput] = React.useState((initialProfile?.skills || []).join(", "));
  const [interestsInput, setInterestsInput] = React.useState((initialProfile?.interests || []).join(", "));
  const [theme, setTheme] = React.useState(initialProfile?.theme || "minimal");
  const [isPublic, setIsPublic] = React.useState(
    initialProfile?.isPublic !== undefined && initialProfile?.isPublic !== null ? initialProfile.isPublic : true
  );

  // Settings State (Default OFF)
  const [showEmail, setShowEmail] = React.useState(Boolean(initialSettings.showEmail));
  const [resumeUrl, setResumeUrl] = React.useState(initialSettings.resumeUrl || "");
  const [showGithubStats, setShowGithubStats] = React.useState(Boolean(initialSettings.showGithubStats));
  const [showSkillIcons, setShowSkillIcons] = React.useState(Boolean(initialSettings.showSkillIcons));
  const [statsTheme, setStatsTheme] = React.useState(initialSettings.statsTheme || "github_dark");

  // Connected Accounts State
  const ghAccount = initialAccounts.find((a) => a.provider === "github");
  const [portfolioUrl, setPortfolioUrl] = React.useState(
    initialAccounts.find((a) => a.provider === "portfolio")?.profileUrl || ""
  );
  const [leetcodeHandle, setLeetcodeHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "leetcode")?.handle || ""
  );
  const [codechefHandle, setCodechefHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "codechef")?.handle || ""
  );
  const [codeforcesHandle, setCodeforcesHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "codeforces")?.handle || ""
  );
  const [hashnodeHandle, setHashnodeHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "hashnode")?.handle || ""
  );
  const [devtoHandle, setDevtoHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "devto")?.handle || ""
  );
  const [gitlabHandle, setGitlabHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "gitlab")?.handle || ""
  );
  const [codepenHandle, setCodepenHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "codepen")?.handle || ""
  );
  const [linkedinUrl, setLinkedinUrl] = React.useState(
    initialAccounts.find((a) => a.provider === "linkedin")?.handle ||
      initialAccounts.find((a) => a.provider === "linkedin")?.profileUrl ||
      ""
  );
  const [peerlistHandle, setPeerlistHandle] = React.useState(
    initialAccounts.find((a) => a.provider === "peerlist")?.handle || ""
  );
  const [notionfolioUrl, setNotionfolioUrl] = React.useState(
    initialAccounts.find((a) => a.provider === "notionfolio")?.profileUrl || ""
  );

  // Pinned Projects State
  const [pinnedProjects, setPinnedProjects] = React.useState<PinnedProject[]>(
    Array.isArray(projectsBlock?.content) ? (projectsBlock.content as PinnedProject[]) : []
  );

  // Personal Blogs State
  const [personalBlogs, setPersonalBlogs] = React.useState<PersonalBlogPost[]>(
    Array.isArray(blogsBlock?.content) ? (blogsBlock.content as PersonalBlogPost[]) : []
  );

  // New Project Form State
  const [newProject, setNewProject] = React.useState({
    title: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
    tags: "",
    imageUrl: "",
    showImage: true,
  });
  const [addingProject, setAddingProject] = React.useState(false);

  // New Blog Form State
  const [newBlog, setNewBlog] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
  });
  const [addingBlog, setAddingBlog] = React.useState(false);

  const [slugStatus, setSlugStatus] = React.useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Debounced slug check
  React.useEffect(() => {
    if (!slug || slug === initialProfile?.slug) {
      setSlugStatus("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const res = await fetch(`/api/profile/check-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "unavailable");
      } catch {
        setSlugStatus("unavailable");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, initialProfile?.slug]);

  // Project Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const proj: PinnedProject = {
      id: `proj_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      repoUrl: newProject.repoUrl.trim() || undefined,
      demoUrl: newProject.demoUrl.trim() || undefined,
      tags: newProject.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: newProject.imageUrl.trim() || undefined,
      showImage: newProject.showImage,
      order: pinnedProjects.length,
    };

    setPinnedProjects([...pinnedProjects, proj]);
    setNewProject({
      title: "",
      description: "",
      repoUrl: "",
      demoUrl: "",
      tags: "",
      imageUrl: "",
      showImage: true,
    });
    setAddingProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setPinnedProjects(pinnedProjects.filter((p) => p.id !== id));
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= pinnedProjects.length) return;
    const reordered = [...pinnedProjects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setPinnedProjects(reordered.map((p, idx) => ({ ...p, order: idx })));
  };

  // Blog Handlers
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title.trim()) return;

    const postSlug =
      newBlog.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") ||
      newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const post: PersonalBlogPost = {
      id: `post_${Date.now()}`,
      slug: postSlug,
      title: newBlog.title.trim(),
      excerpt: newBlog.excerpt.trim() || newBlog.content.slice(0, 150).trim(),
      content: newBlog.content.trim(),
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: Math.max(1, Math.round(newBlog.content.split(/\s+/).length / 200)),
      tags: newBlog.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setPersonalBlogs([post, ...personalBlogs]);
    setNewBlog({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
    });
    setAddingBlog(false);
  };

  const handleRemoveBlog = (id: string) => {
    setPersonalBlogs(personalBlogs.filter((b) => b.id !== id));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const interests = interestsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          displayName,
          bio,
          department,
          batchId: batchId || null,
          skills,
          interests,
          theme,
          isPublic,
          isPublished: true,
          showEmail,
          resumeUrl,
          showGithubStats,
          showSkillIcons,
          statsTheme,
          pinnedProjects,
          personalBlogs,
          accounts: {
            portfolio: portfolioUrl,
            leetcode: leetcodeHandle,
            codechef: codechefHandle,
            codeforces: codeforcesHandle,
            hashnode: hashnodeHandle,
            devto: devtoHandle,
            gitlab: gitlabHandle,
            codepen: codepenHandle,
            linkedin: linkedinUrl,
            peerlist: peerlistHandle,
            notionfolio: notionfolioUrl,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile, developer links, projects & blogs saved successfully!" });
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error saving profile";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-xl p-4 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-card p-1 text-xs shadow-sm">
        {[
          { id: "identity", label: "Identity & Bio", icon: Sparkles },
          { id: "accounts", label: "Developer Accounts", icon: Code2 },
          { id: "projects", label: `Pinned Projects (${pinnedProjects.length})`, icon: FolderGit2 },
          { id: "blogs", label: `Personal Blogs (${personalBlogs.length})`, icon: BookOpen },
          { id: "theme", label: "Theme & Stats", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: IDENTITY & BIO */}
        {activeTab === "identity" && (
          <div className="space-y-6">
            {/* Slug Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">Personal URL / Handle</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your public mini-site path on the ACM BIT Mesra platform.
              </p>

              <div className="mt-4">
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    acmbitm.campsy.app/u/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-handle"
                    className="flex-1 bg-transparent px-2 py-2.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                  <div className="pr-3">
                    {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {slugStatus === "available" && <Check className="h-4 w-4 text-emerald-500" />}
                    {slugStatus === "unavailable" && (
                      <span className="text-[10px] font-semibold text-red-500">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>

              {initialProfile?.slug && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>Public URL:</span>
                  <a
                    href={`/u/${initialProfile.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline inline-flex items-center gap-1"
                  >
                    /u/{initialProfile.slug}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Academic Information */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground">Academic Information</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Shaswat Raj"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Academic Cohort / Batch
                  </label>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Academic Batch</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label} (Graduating {b.endYear})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department of Computer Science & Engineering"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Resume / CV Link
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or PDF URL"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Show Student Email</div>
                    <div className="text-[10px] text-muted-foreground">{userEmail}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showEmail ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                        showEmail ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground">Developer Bio & Technical Skills</h2>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Bio (Markdown supported)
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself, your technical interests, algorithms, and projects..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Skills & Technologies (comma-separated, automatically converted to skillicons.dev icons)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="TypeScript, Python, Rust, React, Next.js, Node.js, Tailwind, PostgreSQL, Docker, Git"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Interests & Domains (comma-separated)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="Competitive Programming, Systems Architecture, Open Source, Compilers"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPER ACCOUNTS */}
        {activeTab === "accounts" && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold text-foreground">Connected Coding & Developer Profiles</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Display verified accounts with official badges and dynamic stats on your public profile.
              </p>
            </div>

            {/* GitHub Banner */}
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <GithubIcon className="h-6 w-6 text-foreground shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <span>GitHub</span>
                      {ghAccount ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          OAuth Verified @{ghAccount.handle}
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          Not Linked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Required for Hacktoberfest pull request scoring and automatic GitHub stats card embedding.
                    </p>
                  </div>
                </div>

                <div>
                  {ghAccount ? (
                    <a
                      href={ghAccount.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted shadow-sm"
                    >
                      <span>View GitHub Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <a
                      href="/api/integrations/github/connect?returnTo=/dashboard/profile"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <span>Connect GitHub Account</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Codeforces */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Codeforces Handle
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    codeforces.com/profile/
                  </span>
                  <input
                    type="text"
                    value={codeforcesHandle.replace(/https?:\/\/(www\.)?codeforces\.com\/profile\//gi, "")}
                    onChange={(e) => setCodeforcesHandle(e.target.value.trim())}
                    placeholder="tourist"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* CodeChef */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  CodeChef Handle
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    codechef.com/users/
                  </span>
                  <input
                    type="text"
                    value={codechefHandle.replace(/https?:\/\/(www\.)?codechef\.com\/users\//gi, "")}
                    onChange={(e) => setCodechefHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* LeetCode */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  LeetCode Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    leetcode.com/u/
                  </span>
                  <input
                    type="text"
                    value={leetcodeHandle.replace(/https?:\/\/(www\.)?leetcode\.com\/(u\/)?/gi, "")}
                    onChange={(e) => setLeetcodeHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Hashnode */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Hashnode Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    hashnode.com/@
                  </span>
                  <input
                    type="text"
                    value={hashnodeHandle.replace(/https?:\/\/(www\.)?hashnode\.com\/@?/gi, "")}
                    onChange={(e) => setHashnodeHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* DEV.to */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  DEV.to Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    dev.to/
                  </span>
                  <input
                    type="text"
                    value={devtoHandle.replace(/https?:\/\/(www\.)?dev\.to\//gi, "")}
                    onChange={(e) => setDevtoHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Peerlist */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Peerlist Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    peerlist.io/
                  </span>
                  <input
                    type="text"
                    value={peerlistHandle.replace(/https?:\/\/(www\.)?peerlist\.io\//gi, "")}
                    onChange={(e) => setPeerlistHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* GitLab */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GitLab Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    gitlab.com/
                  </span>
                  <input
                    type="text"
                    value={gitlabHandle.replace(/https?:\/\/(www\.)?gitlab\.com\//gi, "")}
                    onChange={(e) => setGitlabHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* CodePen */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  CodePen Username
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    codepen.io/
                  </span>
                  <input
                    type="text"
                    value={codepenHandle.replace(/https?:\/\/(www\.)?codepen\.io\//gi, "")}
                    onChange={(e) => setCodepenHandle(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  LinkedIn Profile
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    value={linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//gi, "")}
                    onChange={(e) => setLinkedinUrl(e.target.value.trim())}
                    placeholder="username"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Notionfolio */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Notionfolio / Notion Portfolio URL
                </label>
                <input
                  type="text"
                  value={notionfolioUrl}
                  onChange={(e) => setNotionfolioUrl(e.target.value.trim())}
                  placeholder="https://yourname.notion.site/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Personal Portfolio Website */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Personal Portfolio / Domain Website
                </label>
                <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 pr-1 font-mono text-xs text-muted-foreground select-none">
                    https://
                  </span>
                  <input
                    type="text"
                    value={portfolioUrl.replace(/^https?:\/\//i, "")}
                    onChange={(e) => setPortfolioUrl(e.target.value.trim() ? `https://${e.target.value.replace(/^https?:\/\//i, "").trim()}` : "")}
                    placeholder="alex.dev"
                    className="flex-1 bg-transparent px-1 py-2 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PINNED TOP PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Pinned Top Projects</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Highlight your best engineering work, prototypes, and open source projects on your profile.
                  </p>
                </div>
                {!addingProject && (
                  <button
                    type="button"
                    onClick={() => setAddingProject(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {/* Add Project Sub-form */}
              {addingProject && (
                <div className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.04] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-foreground">New Project Details</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Distributed Consensus Engine"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Tech Stack Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                        placeholder="Rust, Raft, Tokio, RocksDB"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Key technical achievements, architectural design, and impact..."
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        GitHub Repo URL
                      </label>
                      <input
                        type="url"
                        value={newProject.repoUrl}
                        onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={newProject.demoUrl}
                        onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                        placeholder="https://myproject.app"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Screenshot / Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={newProject.imageUrl}
                        onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="showImageCheck"
                        checked={newProject.showImage}
                        onChange={(e) => setNewProject({ ...newProject, showImage: e.target.checked })}
                        className="rounded border-border text-primary"
                      />
                      <label htmlFor="showImageCheck" className="text-xs text-foreground cursor-pointer select-none">
                        Show Image Banner on Profile
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAddingProject(false)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List with Reordering */}
              <div className="mt-5 space-y-3">
                {pinnedProjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    No pinned projects added yet. Click &quot;Add Project&quot; to showcase your top builds!
                  </div>
                ) : (
                  pinnedProjects.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-background p-4 shadow-sm"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">{p.title}</span>
                          {p.showImage && p.imageUrl && (
                            <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] text-muted-foreground font-mono">
                              has image
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.tags.map((t) => (
                            <span key={t} className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] text-secondary-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveProject(idx, "up")}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === pinnedProjects.length - 1}
                          onClick={() => handleMoveProject(idx, "down")}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(p.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-500/10"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PERSONAL BLOGS */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Personal Profile Articles & Blogs</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Write articles that are published exclusively on your developer mini-site.
                  </p>
                </div>
                {!addingBlog && (
                  <button
                    type="button"
                    onClick={() => setAddingBlog(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Write Article</span>
                  </button>
                )}
              </div>

              {/* Add Blog Sub-form */}
              {addingBlog && (
                <div className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.04] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-foreground">Write Article</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newBlog.title}
                          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                          placeholder="e.g. Understanding Consensus in Distributed Systems"
                          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={newBlog.tags}
                          onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                          placeholder="Distributed Systems, Go, Concurrency"
                          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Short Excerpt / Teaser
                      </label>
                      <input
                        type="text"
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                        placeholder="A concise one-line overview of the problem and key insight..."
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Content (Markdown format) *
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        placeholder="Write your article in Markdown. Code blocks, headers, quotes, and links are supported."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAddingBlog(false)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBlog}
                      className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Publish to Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Blogs List */}
              <div className="mt-5 space-y-3">
                {personalBlogs.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    No articles published yet. Click &quot;Write Article&quot; to publish your thoughts and engineering insights!
                  </div>
                ) : (
                  personalBlogs.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start justify-between rounded-lg border border-border bg-background p-4 shadow-sm"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="font-semibold text-xs text-foreground">{b.title}</div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{b.excerpt}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                          <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{b.readingTimeMinutes || 2} min read</span>
                          <span>·</span>
                          <span className="font-mono">/u/{slug || "me"}/blog/{b.slug}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBlog(b.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-500/10 shrink-0"
                        title="Delete Article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: THEME & DEVELOPER STATS */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            {/* Design System Picker */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-foreground">Select Profile Design System</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose the visual aesthetic for your public personal mini-site at /u/{slug || "your-name"}.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    id: "minimal",
                    name: "Minimal Notion",
                    desc: "Crisp borders, high contrast, distraction-free typography.",
                    badge: "Clean",
                  },
                  {
                    id: "modern",
                    name: "Modern Clean",
                    desc: "Sleek cards, smooth micro-interactions, and refined accent hierarchy.",
                    badge: "Modern",
                  },
                  {
                    id: "terminal",
                    name: "Hacker Terminal",
                    desc: "Monospace font, dark obsidian canvas, neon prompt, and code cards.",
                    badge: "Developer",
                  },
                  {
                    id: "editorial",
                    name: "Editorial Academic",
                    desc: "Formal serif accents, archival layout, and clean column hierarchy.",
                    badge: "Classic",
                  },
                ].map((t) => (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
                      theme === t.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{t.name}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.2 text-[9px] font-bold uppercase text-secondary-foreground">
                          {t.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-muted-foreground leading-normal">{t.desc}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <input
                        type="radio"
                        name="themePicker"
                        value={t.id}
                        checked={theme === t.id}
                        onChange={() => setTheme(t.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {theme === t.id ? "Active" : "Select"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Live Developer Stats Cards Settings */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground">Interactive Image & Stats APIs</h2>
              <p className="text-xs text-muted-foreground">
                Embed verified GitHub profile stats, top languages charts, and skill icons SVG strips on your mini-site.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div>
                    <div className="text-xs font-semibold text-foreground">GitHub Profile & Top Languages Cards</div>
                    <div className="text-[11px] text-muted-foreground">
                      Embeds github-profile-summary-cards and github-stats-extended SVGs
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGithubStats(!showGithubStats)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showGithubStats ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                        showGithubStats ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Interactive Skill Icons Bar</div>
                    <div className="text-[11px] text-muted-foreground">
                      Embeds skillicons.dev icons banner based on your entered skills list
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSkillIcons(!showSkillIcons)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showSkillIcons ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                        showSkillIcons ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Stats SVG Palette
                    </label>
                    <select
                      value={statsTheme}
                      onChange={(e) => setStatsTheme(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
                    >
                      <option value="github_dark">github_dark</option>
                      <option value="blueberry">blueberry</option>
                      <option value="tokyonight">tokyonight</option>
                      <option value="dracula">dracula</option>
                      <option value="material_palenight">material_palenight</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <div className="text-xs font-semibold text-foreground">Public Mini-Site</div>
                      <div className="text-[10px] text-muted-foreground">Discoverable at /u/{slug || "me"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublic(!isPublic)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        isPublic ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                          isPublic ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            {initialProfile?.slug ? (
              <span>Saved changes update your live profile at /u/{initialProfile.slug}</span>
            ) : (
              <span>Fill out your details to claim your profile URL</span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || slugStatus === "checking" || slugStatus === "unavailable"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Save Profile & Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
