import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { AuthUser } from '../common/decorators';
import { ScopeService } from '../common/scope.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private scope: ScopeService,
  ) {}

  findAll(actor: AuthUser) {
    const where =
      actor.role === UserRole.EXPLOITANT
        ? {}
        : actor.role === UserRole.REGULATEUR
          ? { jurisdictionId: actor.jurisdictionId! }
          : { gameOperatorId: actor.gameOperatorId! };
    return this.prisma.user
      .findMany({
        where,
        include: { jurisdiction: true, gameOperator: true },
        orderBy: { createdAt: 'desc' },
      })
      .then((users) => users.map(({ password: _, ...u }) => u));
  }

  async create(actor: AuthUser, dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await bcrypt.hash(dto.password, 12),
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role as UserRole,
        jurisdictionId: dto.jurisdictionId,
        gameOperatorId: dto.gameOperatorId,
      },
      include: { jurisdiction: true, gameOperator: true },
    });
    await this.audit.log({
      userId: actor.id,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });
    const { password: _, ...safe } = user;
    return safe;
  }

  async update(actor: AuthUser, id: string, dto: UpdateUserDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { jurisdiction: true, gameOperator: true },
    });
    await this.audit.log({ userId: actor.id, action: 'UPDATE', entity: 'User', entityId: id });
    const { password: _, ...safe } = user;
    return safe;
  }

  async remove(actor: AuthUser, id: string) {
    await this.prisma.user.delete({ where: { id } });
    await this.audit.log({ userId: actor.id, action: 'DELETE', entity: 'User', entityId: id });
    return { message: 'Utilisateur supprimé' };
  }
}
