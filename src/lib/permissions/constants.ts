export const PERMISSIONS = {
  // Blog / Knowledge CMS
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

  // Events & Contests
  EVENTS_CREATE: "events:create",
  EVENTS_EDIT: "events:edit",
  EVENTS_PUBLISH: "events:publish",
  EVENTS_DELETE: "events:delete",

  // Resources Hub
  RESOURCES_CREATE: "resources:create",
  RESOURCES_EDIT: "resources:edit",
  RESOURCES_DELETE: "resources:delete",

  // Announcements & Banners
  ANNOUNCEMENTS_MANAGE: "announcements:manage",

  // Media & Gallery
  GALLERY_MANAGE: "gallery:manage",

  // Sponsors & Partnerships
  SPONSORS_MANAGE: "sponsors:manage",

  // Members & Governance
  ADMIN_MANAGE_MEMBERS: "admin:manage_members",
  MEMBERS_ASSIGN_ROLES: "members:assign_roles",
  MEMBERS_VIEW: "members:view",

  // System, Audit & Site Settings
  AUDIT_VIEW: "audit:view",
  SYSTEM_MANAGE: "system:manage",
  CONTENT_MANAGE: "content:manage",
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
    key: "SUPER_ADMIN",
    displayName: "Super Admin",
    description: "Full chapter platform authority with unrestricted governance, publishing, security configuration, and administrative rights.",
    hierarchyLevel: 0,
    permissions: Object.values(PERMISSIONS),
  },
  {
    key: "PRESIDENT",
    displayName: "President",
    description: "Executive Head of ACM BIT Mesra Student Chapter with full chapter governance and publishing authority.",
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
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_EDIT,
      PERMISSIONS.EVENTS_PUBLISH,
      PERMISSIONS.EVENTS_DELETE,
      PERMISSIONS.RESOURCES_CREATE,
      PERMISSIONS.RESOURCES_EDIT,
      PERMISSIONS.RESOURCES_DELETE,
      PERMISSIONS.ANNOUNCEMENTS_MANAGE,
      PERMISSIONS.GALLERY_MANAGE,
      PERMISSIONS.SPONSORS_MANAGE,
      PERMISSIONS.ADMIN_MANAGE_MEMBERS,
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.CONTENT_MANAGE,
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
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_EDIT,
      PERMISSIONS.EVENTS_PUBLISH,
      PERMISSIONS.RESOURCES_CREATE,
      PERMISSIONS.RESOURCES_EDIT,
      PERMISSIONS.ANNOUNCEMENTS_MANAGE,
      PERMISSIONS.GALLERY_MANAGE,
      PERMISSIONS.SPONSORS_MANAGE,
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.CONTENT_MANAGE,
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
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_EDIT,
      PERMISSIONS.RESOURCES_CREATE,
      PERMISSIONS.RESOURCES_EDIT,
      PERMISSIONS.GALLERY_MANAGE,
      PERMISSIONS.MEMBERS_VIEW,
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
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_EDIT,
      PERMISSIONS.RESOURCES_CREATE,
      PERMISSIONS.RESOURCES_EDIT,
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.SYSTEM_MANAGE,
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
      PERMISSIONS.ANNOUNCEMENTS_MANAGE,
      PERMISSIONS.GALLERY_MANAGE,
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
      PERMISSIONS.RESOURCES_CREATE,
      PERMISSIONS.RESOURCES_EDIT,
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

export function isSuperAdmin(roleKey: string): boolean {
  return roleKey === "SUPER_ADMIN";
}

export function hasPermission(userPermissions: string[], required: Permission): boolean {
  return userPermissions.includes(required);
}

export function canManageHierarchy(actorLevel: number, targetLevel: number): boolean {
  if (actorLevel === 0) return true; // Super admin can manage anyone
  return actorLevel < targetLevel; // Higher rank has lower numerical level
}

export function getRoleByKey(key: string): RoleDefinition | undefined {
  return DEFAULT_ROLES.find((r) => r.key === key);
}
