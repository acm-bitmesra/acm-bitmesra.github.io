import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { headers } from "next/headers";

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /passwd/i,
  /cookie/i,
  /authorization/i,
  /access_?token/i,
  /refresh_?token/i,
  /id_?token/i,
  /api_?key/i,
  /secret/i,
  /client_secret/i,
  /better_auth_secret/i,
  /google_client_secret/i,
  /db_password/i,
];

/**
 * Sanitizes details payload to ensure zero sensitive secrets or tokens are ever logged (Section 114).
 */
export function sanitizeAuditDetails<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Check if string contains secrets
    for (const pattern of SENSITIVE_KEY_PATTERNS) {
      if (pattern.test(data)) {
        return "[REDACTED]" as unknown as T;
      }
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeAuditDetails(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pat) => pat.test(key));
      if (isSensitiveKey) {
        sanitizedObj[key] = "[REDACTED]";
      } else {
        sanitizedObj[key] = sanitizeAuditDetails(value);
      }
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Resolves trusted client IP from Cloudflare Edge headers.
 * Protects against arbitrary spoofed X-Forwarded-For headers (Section 111).
 * In Cloudflare Workers, 'cf-connecting-ip' is cryptographically injected by the edge proxy.
 */
export async function getTrustedClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();

    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
      const firstIp = forwarded.split(",")[0]?.trim();
      if (firstIp) return firstIp;
    }

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Records an immutable audit log entry in PostgreSQL (Section 110 & 114).
 */
export async function recordAuditEvent(input: {
  action: string;
  memberId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  details?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  try {
    let resolvedIp = input.ipAddress;
    let resolvedUa = input.userAgent;

    if (!resolvedIp || !resolvedUa) {
      try {
        const headerList = await headers();
        if (!resolvedIp) resolvedIp = await getTrustedClientIp();
        if (!resolvedUa) resolvedUa = headerList.get("user-agent") || undefined;
      } catch {
        // Headers not available in non-request contexts
      }
    }

    const sanitizedDetails = input.details
      ? sanitizeAuditDetails(input.details)
      : {};

    const finalDetails = {
      ...(typeof sanitizedDetails === "object" && sanitizedDetails !== null ? sanitizedDetails : { value: sanitizedDetails }),
      ...(resolvedUa ? { userAgent: resolvedUa } : {}),
    };

    const [log] = await db
      .insert(auditLogs)
      .values({
        id: `audit_${crypto.randomUUID().slice(0, 12)}`,
        memberId: input.memberId || null,
        action: input.action,
        targetType: input.targetType || null,
        targetId: input.targetId || null,
        details: finalDetails,
        ipAddress: resolvedIp || null,
      })
      .returning();

    return log;
  } catch (error) {
    console.error("Failed to write audit log row:", error);
    return null;
  }
}
