import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  async dashboard(user: AuthUser) {
    const payFilter = this.scope.getPaymentFilter(user);
    const betFilter = this.scope.getBetFilter(user);

    const [payments, bets, jurisdictions, operators, outsidePayments, undeclaredBets] = await Promise.all([
      this.prisma.paymentTransaction.count({ where: payFilter }),
      this.prisma.betTransaction.count({ where: betFilter }),
      user.role === UserRole.EXPLOITANT
        ? this.prisma.jurisdiction.count({ where: { active: true } })
        : 1,
      this.prisma.gameOperator.count({
        where: user.role === UserRole.EXPLOITANT ? { active: true } : { jurisdictionId: user.jurisdictionId!, active: true },
      }),
      this.prisma.paymentTransaction.count({ where: { ...payFilter, outsideConcentrator: true } }),
      this.prisma.betTransaction.count({ where: { ...betFilter, undeclared: true } }),
    ]);

    const paymentVolume = await this.prisma.paymentTransaction.aggregate({
      where: payFilter,
      _sum: { amount: true },
    });
    const pbj = await this.prisma.betTransaction.aggregate({
      where: betFilter,
      _sum: { amount: true },
    });

    const byChannel = await this.prisma.paymentTransaction.groupBy({
      by: ['channel'],
      where: payFilter,
      _count: true,
      _sum: { amount: true },
    });

    return {
      totals: {
        payments,
        bets,
        jurisdictions,
        operators,
        outsidePayments,
        undeclaredBets,
        paymentVolume: paymentVolume._sum.amount ?? 0,
        pbj: pbj._sum.amount ?? 0,
      },
      byChannel,
      role: user.role,
    };
  }
}
