export const PERMISSIONS = {
  BLOG_CREATE: "blog:create",
  BLOG_EDIT_OWN: "blog:edit:own",
  BLOG_EDIT_ANY: "blog:edit:any",
  BLOG_SUBMIT: "blog:submit",
  BLOG_REVIEW: "blog:review",
  BLOG_PUBLISH: "blog:publish",
  BLOG_UNPUBLISH: "blog:unpublish",
  BLOG_DELETE: "blog:delete",
  BLOG_MANAGE_AUTHORS: "blog:manage_authors",
  BLOG_MANAGE_TAGS: "blog:manage_tags",
  BLOG_MANAGE_FEATURED: "blog:manage_featured",
  ADMIN_MANAGE_MEMBERS: "admin:manage_members",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface RoleDefinition {
  key: string;
  displayName: string;
  description: string;
  hierarchyLevel: number;
  permissions: Permission[];
}

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    key: "PRESIDENT",
    displayName: "President",
    description: "Executive Head of ACM BIT Mesra Student Chapter with full governance and publishing authority.",
    hierarchyLevel: 1,
    permissions: Object.values(PERMISSIONS),
  },
  {
    key: "VICE_PRESIDENT",
    displayName: "Vice President",
    description: "Chapter Vice President with full executive and editorial publishing privileges.",
    hierarchyLevel: 2,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_UNPUBLISH,
      PERMISSIONS.BLOG_DELETE,
      PERMISSIONS.BLOG_MANAGE_AUTHORS,
      PERMISSIONS.BLOG_MANAGE_TAGS,
      PERMISSIONS.BLOG_MANAGE_FEATURED,
      PERMISSIONS.ADMIN_MANAGE_MEMBERS,
    ],
  },
  {
    key: "GENERAL_SECRETARY",
    displayName: "General Secretary",
    description: "General Secretary managing chapter communications, activities, and verified publications.",
    hierarchyLevel: 3,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_UNPUBLISH,
      PERMISSIONS.BLOG_MANAGE_AUTHORS,
      PERMISSIONS.BLOG_MANAGE_TAGS,
      PERMISSIONS.BLOG_MANAGE_FEATURED,
    ],
  },
  {
    key: "JOINT_SECRETARY",
    displayName: "Joint Secretary",
    description: "Joint Secretary coordinating chapter operations, technical documentation, and article reviews.",
    hierarchyLevel: 4,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_MANAGE_AUTHORS,
      PERMISSIONS.BLOG_MANAGE_TAGS,
      PERMISSIONS.BLOG_MANAGE_FEATURED,
    ],
  },
  {
    key: "TECHNICAL_HEAD",
    displayName: "Technical Head",
    description: "Head of Technical Wing leading software architecture, research notes, and systems articles.",
    hierarchyLevel: 5,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_MANAGE_TAGS,
      PERMISSIONS.BLOG_MANAGE_FEATURED,
    ],
  },
  {
    key: "CONTENT_HEAD",
    displayName: "Content Head",
    description: "Editorial lead managing chapter storytelling, documentation standards, and publication queues.",
    hierarchyLevel: 6,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_MANAGE_TAGS,
      PERMISSIONS.BLOG_MANAGE_FEATURED,
    ],
  },
  {
    key: "AUTHORIZED_EDITOR",
    displayName: "Authorized Editor",
    description: "Designated chapter member explicitly empowered to review, edit, and publish technical articles.",
    hierarchyLevel: 7,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_MANAGE_TAGS,
    ],
  },
  {
    key: "SIG_LEAD",
    displayName: "SIG Lead",
    description: "Special Interest Group lead authoring deep-dive technical tutorials and research summaries.",
    hierarchyLevel: 8,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_SUBMIT,
    ],
  },
  {
    key: "CHAPTER_MEMBER",
    displayName: "Chapter Member",
    description: "Active ACM BIT Mesra member with authoring permissions to draft and submit engineering notes.",
    hierarchyLevel: 10,
    permissions: [
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_SUBMIT,
    ],
  },
];
