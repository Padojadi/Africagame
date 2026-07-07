import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/payment.dto';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private scope: ScopeService) {}

  async initiate(operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } }, dto: InitiatePaymentDto) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.paymentTransaction.findUnique({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) return existing;
    }

    const payment = await this.prisma.paymentTransaction.create({
      data: {
        gameOperatorId: operator.id,
        jurisdictionId: operator.jurisdictionId,
        nature: dto.nature,
        amount: dto.amount,
        currencyCode: operator.jurisdiction.currency.code,
        channel: dto.channel,
        msisdn: dto.msisdn,
        sessionId: dto.sessionId,
        actorRef: dto.actorRef,
        externalId: dto.externalId,
        idempotencyKey: dto.idempotencyKey,
        status: PaymentStatus.PENDING,
        steps: {
          create: { stepOrder: 1, stepType: 'INITIATION', status: PaymentStatus.PENDING },
        },
      },
      include: { steps: true },
    });
    return payment;
  }

  async webhook(dto: PaymentWebhookDto) {
    const payment = await this.prisma.paymentTransaction.findUnique({ where: { id: dto.transactionId } });
    if (!payment) throw new NotFoundException('Transaction introuvable');

    const status = dto.status.toUpperCase() as PaymentStatus;
    return this.prisma.paymentTransaction.update({
      where: { id: dto.transactionId },
      data: {
        status: Object.values(PaymentStatus).includes(status) ? status : PaymentStatus.ERROR,
        steps: {
          create: {
            stepOrder: (await this.prisma.paymentStep.count({ where: { paymentId: payment.id } })) + 1,
            stepType: 'WEBHOOK',
            status: status,
            payload: dto.payload as object | undefined,
          },
        },
      },
      include: { steps: true },
    });
  }

  findAll(user: AuthUser, filters?: { channel?: string; status?: string }) {
    return this.prisma.paymentTransaction.findMany({
      where: {
        ...this.scope.getPaymentFilter(user),
        channel: filters?.channel as never,
        status: filters?.status as never,
      },
      include: { gameOperator: true, jurisdiction: true },
      orderBy: { operatedAt: 'desc' },
      take: 200,
    });
  }

  getStats(user: AuthUser) {
    const where = this.scope.getPaymentFilter(user);
    return this.prisma.paymentTransaction.groupBy({
      by: ['channel', 'status'],
      where,
      _count: true,
      _sum: { amount: true },
    });
  }
}
