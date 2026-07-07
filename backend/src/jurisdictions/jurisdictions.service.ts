import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class JurisdictionsService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  findAll(user: AuthUser) {
    return this.prisma.jurisdiction.findMany({
      where: { ...this.scope.getJurisdictionFilter(user), active: true },
      include: { currency: true, allowedChannels: true, _count: { select: { gameOperators: true } } },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.jurisdiction.findUnique({
      where: { id },
      include: {
        currency: true,
        allowedChannels: true,
        regulatoryRules: { where: { active: true } },
        paymentProviders: { where: { active: true } },
      },
    });
  }
}
