import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService, ScopeService],
})
export class BetsModule {}
