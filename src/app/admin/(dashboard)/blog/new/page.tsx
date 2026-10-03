import { getAuthorizedMember } from "@/lib/auth/session";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const context = (await getAuthorizedMember())!;

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Create New Article</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Draft a technical deep dive, tutorial, research paper, or official ACM BIT Mesra announcement.
        </p>
      </div>

      <ArticleForm
        mode="create"
        userPermissions={context.permissions}
        userRoleName={context.role.displayName}
        userName={context.member.name}
      />
    </div>
  );
}
