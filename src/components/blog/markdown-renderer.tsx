import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
}

// Sanitization schema to allow standard technical Markdown formatting while blocking malicious scripts and attributes
const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
    span: [...(defaultSchema.attributes?.span || []), "className"],
    div: [...(defaultSchema.attributes?.div || []), "className"],
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 leading-relaxed text-foreground/90 font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, customSanitizeSchema]]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-8 mb-4 border-b border-border/60 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 mb-3 border-b border-border/40 pb-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold tracking-tight text-foreground mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-1.5 text-sm sm:text-base text-muted-foreground mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm sm:text-base text-muted-foreground mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/80 pl-4 my-4 italic text-muted-foreground bg-secondary/20 py-2 rounded-r-md">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border/60 my-8" />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded bg-secondary/80 border border-border/60 px-1.5 py-0.5 font-mono text-xs text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="rounded-lg border border-border/80 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 overflow-x-auto my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-border/60">
              <table className="w-full text-left text-xs font-mono border-collapse divide-y divide-border/60">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/40">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-border/40">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-secondary/20 transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="p-3 font-semibold text-foreground tracking-wider uppercase text-[10px]">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="p-3 text-muted-foreground">{children}</td>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
