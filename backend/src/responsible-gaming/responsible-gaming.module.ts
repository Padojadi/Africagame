import { Module } from '@nestjs/common';
import { ResponsibleGamingService } from './responsible-gaming.service';
import { ResponsibleGamingController } from './responsible-gaming.controller';
import { ScopeService } from '../common/scope.service';

@Module({
  controllers: [ResponsibleGamingController],
  providers: [ResponsibleGamingService, ScopeService],
})
export class ResponsibleGamingModule {}
