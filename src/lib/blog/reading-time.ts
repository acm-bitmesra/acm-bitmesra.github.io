/**
 * Calculates reading time in minutes based on Markdown content.
 * Standard average reading speed is 200 words per minute.
 */
export function calculateReadingTime(markdown: string): number {
  if (!markdown || !markdown.trim()) return 1;

  // Strip code blocks and Markdown syntax for word count
  const cleanText = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`.*?`/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#*_\->~]/g, "")
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);

  return Math.max(1, minutes);
}
