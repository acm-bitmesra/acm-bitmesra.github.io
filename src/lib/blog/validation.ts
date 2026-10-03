import { z } from "zod";

export const CATEGORIES = [
  "Engineering",
  "Competitive Programming",
  "Research",
  "Projects",
  "Open Source",
  "AI & Data",
  "Systems",
  "Cybersecurity",
  "Community",
  "Events",
  "Student Guides",
] as const;

export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(180, "Title is too long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(15, "Excerpt must be at least 15 characters").max(400, "Excerpt is too long"),
  contentMarkdown: z.string().min(50, "Content must have at least 50 characters of Markdown"),
  category: z.string().min(2, "Select a valid category"),
  tags: z.array(z.string()).default([]),
  coverImageUrl: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
  coverImageAlt: z.string().max(150).optional(),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(250).optional(),
  featured: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().min(1, "Post ID is required"),
  changeNote: z.string().max(200).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
