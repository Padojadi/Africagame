import { Module } from '@nestjs/common';
import { JurisdictionsService } from './jurisdictions.service';
import { JurisdictionsController } from './jurisdictions.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [JurisdictionsController],
  providers: [JurisdictionsService, ScopeService],
  exports: [JurisdictionsService],
})
export class JurisdictionsModule {}
