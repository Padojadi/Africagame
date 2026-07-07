import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  log(params: {
    userId?: string;
    action: AuditAction;
    entity: string;
    entityId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details as object | undefined,
        ipAddress: params.ipAddress,
      },
    });
  }

  findAll(filters?: { entity?: string; userId?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        entity: filters?.entity,
        userId: filters?.userId,
      },
      include: { user: { select: { email: true, firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit ?? 100,
    });
  }
}
