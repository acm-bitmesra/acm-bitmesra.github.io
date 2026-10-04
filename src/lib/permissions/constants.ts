export const PERMISSIONS = {
  // Dashboard & Overview
  DASHBOARD_VIEW: "dashboard:view",

  // Content & Pages
  CONTENT_VIEW: "content:view",
  CONTENT_CREATE: "content:create",
  CONTENT_UPDATE: "content:update",
  CONTENT_DELETE: "content:delete",
  CONTENT_PUBLISH: "content:publish",
  HOMEPAGE_VIEW: "homepage:view",
  HOMEPAGE_UPDATE: "homepage:update",
  PAGES_VIEW: "pages:view",
  PAGES_CREATE: "pages:create",
  PAGES_UPDATE: "pages:update",
  PAGES_DELETE: "pages:delete",
  PAGES_PUBLISH: "pages:publish",

  // Blog / Knowledge CMS
  BLOG_VIEW: "blog:view",
  BLOG_CREATE: "blog:create",
  BLOG_EDIT_OWN: "blog:edit:own",
  BLOG_EDIT_ANY: "blog:edit:any",
  BLOG_UPDATE_OWN: "blog:update:own",
  BLOG_UPDATE_ANY: "blog:update:any",
  BLOG_SUBMIT: "blog:submit",
  BLOG_REVIEW: "blog:review",
  BLOG_APPROVE: "blog:approve",
  BLOG_PUBLISH: "blog:publish",
  BLOG_UNPUBLISH: "blog:unpublish",
  BLOG_ARCHIVE: "blog:archive",
  BLOG_RESTORE: "blog:restore",
  BLOG_DELETE: "blog:delete",
  BLOG_MANAGE_AUTHORS: "blog:manage_authors",
  BLOG_MANAGE_TAGS: "blog:manage_tags",
  BLOG_MANAGE_FEATURED: "blog:manage_featured",

  // Events & Contests
  EVENTS_VIEW: "events:view",
  EVENTS_CREATE: "events:create",
  EVENTS_EDIT: "events:edit",
  EVENTS_UPDATE: "events:update",
  EVENTS_PUBLISH: "events:publish",
  EVENTS_DELETE: "events:delete",
  EVENTS_RESULTS: "events:results",

  // Team & Alumni
  TEAM_VIEW: "team:view",
  TEAM_CREATE: "team:create",
  TEAM_UPDATE: "team:update",
  TEAM_DELETE: "team:delete",
  TEAM_PUBLISH: "team:publish",
  ALUMNI_VIEW: "alumni:view",
  ALUMNI_CREATE: "alumni:create",
  ALUMNI_UPDATE: "alumni:update",
  ALUMNI_DELETE: "alumni:delete",

  // Resources Hub
  RESOURCES_VIEW: "resources:view",
  RESOURCES_CREATE: "resources:create",
  RESOURCES_EDIT: "resources:edit",
  RESOURCES_UPDATE: "resources:update",
  RESOURCES_DELETE: "resources:delete",

  // Gallery & Media
  GALLERY_VIEW: "gallery:view",
  GALLERY_CREATE: "gallery:create",
  GALLERY_UPDATE: "gallery:update",
  GALLERY_DELETE: "gallery:delete",
  GALLERY_MANAGE: "gallery:manage",
  MEDIA_VIEW: "media:view",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",

  // Sponsors
  SPONSORS_VIEW: "sponsors:view",
  SPONSORS_CREATE: "sponsors:create",
  SPONSORS_UPDATE: "sponsors:update",
  SPONSORS_DELETE: "sponsors:delete",
  SPONSORS_MANAGE: "sponsors:manage",

  // Navigation, SEO & Redirects
  NAVIGATION_VIEW: "navigation:view",
  NAVIGATION_UPDATE: "navigation:update",
  SEO_VIEW: "seo:view",
  SEO_UPDATE: "seo:update",
  REDIRECTS_VIEW: "redirects:view",
  REDIRECTS_CREATE: "redirects:create",
  REDIRECTS_UPDATE: "redirects:update",
  REDIRECTS_DELETE: "redirects:delete",

  // Members & Roles Governance
  MEMBERS_VIEW: "members:view",
  MEMBERS_CREATE: "members:create",
  MEMBERS_UPDATE: "members:update",
  MEMBERS_SUSPEND: "members:suspend",
  MEMBERS_OFFBOARD: "members:offboard",
  ADMIN_MANAGE_MEMBERS: "admin:manage_members",
  MEMBERS_ASSIGN_ROLES: "members:assign_roles",
  ROLES_VIEW: "roles:view",
  ROLES_CREATE: "roles:create",
  ROLES_UPDATE: "roles:update",
  ROLES_DELETE: "roles:delete",
  PERMISSIONS_GRANT: "permissions:grant",
  PERMISSIONS_REVOKE: "permissions:revoke",

  // Announcements & Banners
  ANNOUNCEMENTS_MANAGE: "announcements:manage",

  // Audit, Security & Telemetry
  AUDIT_VIEW: "audit:view",
  AUDIT_EXPORT: "audit:export",
  SECURITY_VIEW: "security:view",
  SECURITY_MANAGE: "security:manage",
  SETTINGS_VIEW: "settings:view",
  SETTINGS_UPDATE: "settings:update",
  ANALYTICS_VIEW: "analytics:view",
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
    key: "EVENTS_HEAD",
    displayName: "Events Head",
    description: "Leads technical hackathons, coding contests, workshops, and guest lecture operations.",
    hierarchyLevel: 6,
    permissions: [
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_EDIT,
      PERMISSIONS.EVENTS_UPDATE,
      PERMISSIONS.EVENTS_PUBLISH,
      PERMISSIONS.EVENTS_RESULTS,
      PERMISSIONS.GALLERY_MANAGE,
      PERMISSIONS.ANNOUNCEMENTS_MANAGE,
    ],
  },
  {
    key: "EDITOR",
    displayName: "Editor",
    description: "Editorial team member reviewing and publishing technical submissions.",
    hierarchyLevel: 7,
    permissions: [
      PERMISSIONS.BLOG_VIEW,
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_EDIT_ANY,
      PERMISSIONS.BLOG_UPDATE_OWN,
      PERMISSIONS.BLOG_UPDATE_ANY,
      PERMISSIONS.BLOG_SUBMIT,
      PERMISSIONS.BLOG_REVIEW,
      PERMISSIONS.BLOG_APPROVE,
      PERMISSIONS.BLOG_PUBLISH,
      PERMISSIONS.BLOG_MANAGE_TAGS,
    ],
  },
  {
    key: "AUTHOR",
    displayName: "Author",
    description: "Contributing writer authoring technical articles, tutorials, and research notes.",
    hierarchyLevel: 9,
    permissions: [
      PERMISSIONS.BLOG_VIEW,
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT_OWN,
      PERMISSIONS.BLOG_UPDATE_OWN,
      PERMISSIONS.BLOG_SUBMIT,
    ],
  },
  {
    key: "VIEWER",
    displayName: "Viewer",
    description: "Read-only access to chapter administrative dashboards.",
    hierarchyLevel: 100,
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.BLOG_VIEW,
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.RESOURCES_VIEW,
      PERMISSIONS.MEMBERS_VIEW,
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
