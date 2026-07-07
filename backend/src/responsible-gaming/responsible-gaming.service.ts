import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class ResponsibleGamingService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  findAll(user: AuthUser) {
    const filter = this.scope.getPaymentFilter(user);
    return this.prisma.responsibleGamingProfile.findMany({
      where: { jurisdictionId: filter.jurisdictionId },
      orderBy: { riskLevel: 'desc' },
    });
  }

  async analyzeMsisdn(msisdn: string, jurisdictionId: string) {
    const [deposits, bets] = await Promise.all([
      this.prisma.paymentTransaction.aggregate({
        where: { msisdn, jurisdictionId, nature: 'DEPOT' },
        _sum: { amount: true },
      }),
      this.prisma.betTransaction.aggregate({
        where: { msisdn, jurisdictionId },
        _sum: { amount: true },
      }),
    ]);

    const totalDeposits = Number(deposits._sum.amount ?? 0);
    const totalBets = Number(bets._sum.amount ?? 0);
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (totalDeposits > 500000) riskLevel = 'CRITICAL';
    else if (totalDeposits > 200000) riskLevel = 'HIGH';
    else if (totalDeposits > 50000) riskLevel = 'MEDIUM';

    return this.prisma.responsibleGamingProfile.upsert({
      where: { id: `rg-${msisdn}-${jurisdictionId}` },
      update: { totalDeposits, totalBets, riskLevel },
      create: { id: `rg-${msisdn}-${jurisdictionId}`, msisdn, jurisdictionId, totalDeposits, totalBets, riskLevel },
    });
  }
}
