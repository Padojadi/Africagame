import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class FiscalService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  async calculateLevy(jurisdictionId: string, gameOperatorId: string, periodStart: Date, periodEnd: Date) {
    const rules = await this.prisma.regulatoryRule.findMany({
      where: { jurisdictionId, active: true },
    });
    const bets = await this.prisma.betTransaction.aggregate({
      where: { jurisdictionId, gameOperatorId, operatedAt: { gte: periodStart, lte: periodEnd } },
      _sum: { amount: true },
    });
    const pbj = Number(bets._sum.amount ?? 0);
    const rule = rules[0];
    const rate = rule ? Number(rule.rate) : 0.15;
    const levyAmount = pbj * rate;

    const jurisdiction = await this.prisma.jurisdiction.findUnique({
      where: { id: jurisdictionId },
      include: { currency: true },
    });

    return this.prisma.invoice.create({
      data: {
        jurisdictionId,
        gameOperatorId,
        periodStart,
        periodEnd,
        pbjAmount: pbj,
        levyAmount,
        currencyCode: jurisdiction!.currency.code,
        status: 'GENERATED',
      },
      include: { gameOperator: true, jurisdiction: true },
    });
  }

  findInvoices(user: AuthUser) {
    const filter = this.scope.getPaymentFilter(user);
    return this.prisma.invoice.findMany({
      where: {
        jurisdictionId: filter.jurisdictionId,
        gameOperatorId: filter.gameOperatorId,
      },
      include: { gameOperator: true, jurisdiction: { include: { currency: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  getRules(jurisdictionId: string) {
    return this.prisma.regulatoryRule.findMany({ where: { jurisdictionId, active: true } });
  }
}
