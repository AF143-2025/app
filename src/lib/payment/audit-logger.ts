import { prisma } from "../prisma";

export interface LogAuditEventParams {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, any> | string;
  ipAddress?: string;
}

export async function logAuditEvent({
  userId,
  userEmail,
  action,
  entity,
  entityId,
  details,
  ipAddress = "127.0.0.1",
}: LogAuditEventParams) {
  try {
    const detailsString =
      typeof details === "string" ? details : JSON.stringify(details);

    return await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userEmail: userEmail || null,
        action,
        entity,
        entityId,
        details: detailsString,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("[AuditLogger] Failed to write audit log:", error);
  }
}
