import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ScopeService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
