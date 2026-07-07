import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [ReportingController],
  providers: [ReportingService, ScopeService],
})
export class ReportingModule {}
