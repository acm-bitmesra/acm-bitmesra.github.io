import { notFound } from "next/navigation";
import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminPostById } from "@/db/queries/admin-blog";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const context = (await getAuthorizedMember())!;
  const post = await getAdminPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Edit Article</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Updating &quot;{post.title}&quot; · Manage revisions, metadata, and publication status.
        </p>
      </div>

      <ArticleForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          contentMarkdown: post.contentMarkdown,
          coverImageUrl: post.coverImageUrl,
          coverImageAlt: post.coverImageAlt,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          featured: post.featured,
          status: post.status,
        }}
        userPermissions={context.permissions}
        userRoleName={context.role.displayName}
        userName={context.member.name}
      />
    </div>
  );
}
