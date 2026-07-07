import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createUssdSession(data: { msisdn: string; jurisdictionId: string; gameOperatorId?: string }) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 90 * 1000);
    return this.prisma.ussdSession.create({
      data: { sessionId, msisdn: data.msisdn, jurisdictionId: data.jurisdictionId, gameOperatorId: data.gameOperatorId, channel: Channel.USSD, expiresAt },
    });
  }

  async processSms(data: { messageId: string; msisdn: string; jurisdictionId: string; body: string; keyword?: string }) {
    const existing = await this.prisma.smsMessage.findUnique({ where: { messageId: data.messageId } });
    if (existing) return { ...existing, idempotent: true };

    return this.prisma.smsMessage.create({
      data: { ...data, direction: 'INBOUND', processed: true },
    });
  }

  getActiveSessions(jurisdictionId?: string) {
    return this.prisma.ussdSession.findMany({
      where: { jurisdictionId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
