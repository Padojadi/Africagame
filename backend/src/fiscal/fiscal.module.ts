import { Module } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { FiscalController } from './fiscal.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [FiscalController],
  providers: [FiscalService, ScopeService],
})
export class FiscalModule {}
