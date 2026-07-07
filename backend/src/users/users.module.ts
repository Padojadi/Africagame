import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuditService } from '../common/audit.service';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuditService, ScopeService],
})
export class UsersModule {}
