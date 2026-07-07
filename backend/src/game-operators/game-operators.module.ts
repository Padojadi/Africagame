import { Module } from '@nestjs/common';
import { GameOperatorsService } from './game-operators.service';
import { GameOperatorsController } from './game-operators.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [GameOperatorsController],
  providers: [GameOperatorsService, ScopeService],
})
export class GameOperatorsModule {}
