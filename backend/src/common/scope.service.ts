import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthUser } from './decorators';

@Injectable()
export class ScopeService {
  getPaymentFilter(user: AuthUser) {
    if (user.role === UserRole.EXPLOITANT) return {};
    if (user.role === UserRole.REGULATEUR) return { jurisdictionId: user.jurisdictionId! };
    return { gameOperatorId: user.gameOperatorId! };
  }

  getBetFilter(user: AuthUser) {
    return this.getPaymentFilter(user);
  }

  getJurisdictionFilter(user: AuthUser) {
    if (user.role === UserRole.EXPLOITANT) return {};
    return { id: user.jurisdictionId! };
  }

  getOperatorFilter(user: AuthUser) {
    if (user.role === UserRole.EXPLOITANT) return {};
    if (user.role === UserRole.REGULATEUR) return { jurisdictionId: user.jurisdictionId! };
    return { id: user.gameOperatorId! };
  }

  assertJurisdictionAccess(user: AuthUser, jurisdictionId: string) {
    if (user.role === UserRole.EXPLOITANT) return;
    if (user.jurisdictionId !== jurisdictionId) {
      throw new Error('Accès juridiction interdit');
    }
  }
}
