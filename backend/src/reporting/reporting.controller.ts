import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ReportingService } from './reporting.service';
import { Roles, AuthUser } from '../common/decorators';

@ApiTags('reporting')
@ApiBearerAuth()
@Controller('reporting')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
export class ReportingController {
  constructor(private service: ReportingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Tableau de bord temps réel (selon rôle)' })
  dashboard(@Request() req: { user: AuthUser }) {
    return this.service.dashboard(req.user);
  }
}
