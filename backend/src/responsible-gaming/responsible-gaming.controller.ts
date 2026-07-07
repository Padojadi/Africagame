import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ResponsibleGamingService } from './responsible-gaming.service';
import { Roles, AuthUser } from '../common/decorators';

@ApiTags('responsible-gaming')
@ApiBearerAuth()
@Controller('responsible-gaming')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
export class ResponsibleGamingController {
  constructor(private service: ResponsibleGamingService) {}

  @Get()
  findAll(@Request() req: { user: AuthUser }) {
    return this.service.findAll(req.user);
  }

  @Post('analyze')
  analyze(@Body() body: { msisdn: string; jurisdictionId: string }) {
    return this.service.analyzeMsisdn(body.msisdn, body.jurisdictionId);
  }
}
