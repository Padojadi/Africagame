import { Injectable } from '@nestjs/common';
import { BetStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DeclareBetDto } from './dto/bet.dto';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class BetsService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  async declare(operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } }, dto: DeclareBetDto) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.betTransaction.findUnique({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) return existing;
    }
    return this.prisma.betTransaction.create({
      data: {
        gameOperatorId: operator.id,
        jurisdictionId: operator.jurisdictionId,
        nature: dto.nature,
        amount: dto.amount,
        currencyCode: operator.jurisdiction.currency.code,
        channel: dto.channel,
        msisdn: dto.msisdn,
        gameType: dto.gameType,
        actorRef: dto.actorRef,
        externalId: dto.externalId,
        idempotencyKey: dto.idempotencyKey,
        status: (dto.status as BetStatus) || BetStatus.PENDING,
      },
    });
  }

  async declareBatch(operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } }, bets: DeclareBetDto[]) {
    const results = [];
    for (const bet of bets) {
      results.push(await this.declare(operator, bet));
    }
    return results;
  }

  findAll(user: AuthUser, filters?: { channel?: string; gameType?: string }) {
    return this.prisma.betTransaction.findMany({
      where: {
        ...this.scope.getBetFilter(user),
        channel: filters?.channel as never,
        gameType: filters?.gameType as never,
      },
      include: { gameOperator: true, jurisdiction: true },
      orderBy: { operatedAt: 'desc' },
      take: 200,
    });
  }

  async getPbj(user: AuthUser) {
    const where = this.scope.getBetFilter(user);
    const result = await this.prisma.betTransaction.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });
    return { pbj: result._sum.amount ?? 0, count: result._count };
  }

  getStatsByChannel(user: AuthUser) {
    return this.prisma.betTransaction.groupBy({
      by: ['channel', 'gameType'],
      where: this.scope.getBetFilter(user),
      _count: true,
      _sum: { amount: true },
    });
  }
}
