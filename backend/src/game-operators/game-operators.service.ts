import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class GameOperatorsService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  findAll(user: AuthUser) {
    return this.prisma.gameOperator.findMany({
      where: { ...this.scope.getOperatorFilter(user), active: true },
      include: { jurisdiction: { include: { currency: true } } },
      orderBy: { name: 'asc' },
    });
  }
}
