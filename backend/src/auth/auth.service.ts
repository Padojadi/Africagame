import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { jurisdiction: true, gameOperator: true },
    });
    if (!user || !user.active) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    await this.audit.log({ userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, ipAddress: ip });

    const { password: _, ...safe } = user;
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      jurisdictionId: user.jurisdictionId,
      gameOperatorId: user.gameOperatorId,
    });
    return { user: safe, accessToken: token };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { jurisdiction: { include: { currency: true } }, gameOperator: true },
    });
    if (!user) throw new UnauthorizedException();
    const { password: _, ...safe } = user;
    return safe;
  }
}
