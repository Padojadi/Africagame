import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, API_KEY_AUTH } from './decorators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const apiKey = this.reflector.getAllAndOverride<boolean>(API_KEY_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (apiKey) return true;
    return super.canActivate(context);
  }
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const needsKey = this.reflector.getAllAndOverride<boolean>(API_KEY_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!needsKey) return true;

    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] as string;
    if (!key) throw new UnauthorizedException('Clé API requise');

    const operator = await this.prisma.gameOperator.findUnique({
      where: { apiKey: key, active: true },
      include: { jurisdiction: { include: { currency: true } } },
    });
    if (!operator) throw new UnauthorizedException('Clé API invalide');

    req.operator = operator;
    return true;
  }
}
