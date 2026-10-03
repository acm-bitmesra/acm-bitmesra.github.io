import { pgTable, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * ACM BIT Mesra Organizational Roles
 * Defines display title and default bundle of permissions.
 */
export const chapterRoles = pgTable("chapter_roles", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g. 'PRESIDENT', 'JOINT_SECRETARY', 'TECHNICAL_HEAD', 'AUTHORIZED_EDITOR', 'CHAPTER_MEMBER'
  displayName: text("display_name").notNull(), // e.g. 'President', 'Joint Secretary · ACM BIT Mesra'
  description: text("description"),
  permissionSet: jsonb("permission_set").$type<string[]>().default([]).notNull(),
  hierarchyLevel: integer("hierarchy_level").default(100).notNull(), // 1 = President, 10 = Executive, 50 = Lead, 100 = Member
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * ACM BIT Mesra Authorized Chapter Members
 * The authoritative registry of who belongs to the ACM chapter.
 * Only members in this table can access authoring or editorial features.
 */
export const chapterMembers = pgTable(
  "chapter_members",
  {
    id: text("id").primaryKey(), // Stable internal ID
    authUserId: text("auth_user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(), // Verified Google / university email
    avatarUrl: text("avatar_url"),
    roleId: text("role_id")
      .notNull()
      .references(() => chapterRoles.id),
    status: text("status").default("ACTIVE").notNull(), // 'ACTIVE' | 'INACTIVE' | 'ALUMNI'
    termStart: text("term_start").default("2026-27").notNull(),
    termEnd: text("term_end"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_members_email_idx").on(table.email),
    index("chapter_members_auth_user_idx").on(table.authUserId),
    index("chapter_members_role_idx").on(table.roleId),
  ]
);

/**
 * Granular / Explicit Member Permissions
 * Allows granting specific permissions (e.g., 'blog:publish') to a member
 * without changing their official organizational title.
 */
export const memberPermissions = pgTable(
  "member_permissions",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => chapterMembers.id, { onDelete: "cascade" }),
    permission: text("permission").notNull(), // e.g. 'blog:publish', 'blog:create'
    grantedBy: text("granted_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("member_permissions_member_idx").on(table.memberId),
    index("member_permissions_perm_idx").on(table.permission),
  ]
);
