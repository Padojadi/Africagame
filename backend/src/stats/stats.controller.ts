import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { StatsService } from './stats.service';
import { Roles } from '../common/decorators';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('stats')
@Roles(Role.ADMIN, Role.MODERATOR)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Statistiques tableau de bord admin' })
  getDashboard() {
    return this.statsService.getDashboard();
  }
}
