import Link from "next/link";
import { getAdminPosts } from "@/db/queries/admin-blog";
import { formatDate } from "@/lib/date";
import { BlogPostStatus } from "@/db/schema";
import {
  Plus,
  Eye,
  Edit3,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Archive,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminBlogPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const resolvedParams = await searchParams;
  const rawStatus = resolvedParams.status?.toUpperCase() as BlogPostStatus | "ALL" | undefined;

  const validStatuses: (BlogPostStatus | "ALL")[] = [
    "ALL",
    "PUBLISHED",
    "IN_REVIEW",
    "DRAFT",
    "ARCHIVED",
  ];

  const currentStatus: BlogPostStatus | "ALL" = rawStatus && validStatuses.includes(rawStatus)
    ? rawStatus
    : "ALL";

  const posts = await getAdminPosts(currentStatus === "ALL" ? undefined : currentStatus);

  const tabs = [
    { label: "All Posts", value: "ALL", icon: FileText },
    { label: "Published", value: "PUBLISHED", icon: CheckCircle2 },
    { label: "In Review", value: "IN_REVIEW", icon: Clock },
    { label: "Drafts", value: "DRAFT", icon: AlertCircle },
    { label: "Archived", value: "ARCHIVED", icon: Archive },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Articles Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Author, edit, review, and control lifecycle of all chapter publications.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white font-medium text-xs transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === "ALL" ? "/admin/blog" : `/admin/blog?status=${tab.value}`}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold border border-zinc-700"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Articles Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <FileText className="h-8 w-8 text-zinc-600 mx-auto" />
            <div className="text-sm text-zinc-400">No articles found in this category.</div>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 text-xs text-[#E31B23] hover:underline"
            >
              Write the first one <Plus className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white truncate text-sm">
                        <Link href={`/admin/blog/${post.id}/edit`} className="hover:underline">
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-zinc-500 font-mono text-[11px] truncate mt-0.5">
                        /{post.slug} · {post.readingTimeMinutes} min read
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="font-medium text-white">{post.createdByMember.name}</div>
                      <div className="text-zinc-500 text-[10px] font-mono">{post.createdByMember.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border inline-block ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                            : post.status === "IN_REVIEW"
                            ? "bg-amber-950/40 border-amber-800/60 text-amber-400"
                            : post.status === "ARCHIVED"
                            ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                            : "bg-sky-950/40 border-sky-800/60 text-sky-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {formatDate(post.updatedAt.toISOString())}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/blog/${post.id}/preview`}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Preview draft"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Edit article"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>

                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
                            title="View live post"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
