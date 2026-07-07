import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
