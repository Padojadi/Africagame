import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const API_KEY_AUTH = 'apiKey';
export const ApiKeyAuth = () => SetMetadata(API_KEY_AUTH, true);

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  jurisdictionId?: string | null;
  gameOperatorId?: string | null;
}
