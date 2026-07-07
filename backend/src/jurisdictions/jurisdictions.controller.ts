import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JurisdictionsService } from './jurisdictions.service';
import { Roles } from '../common/decorators';
import { AuthUser } from '../common/decorators';
import { Request } from '@nestjs/common';

@ApiTags('jurisdictions')
@ApiBearerAuth()
@Controller('jurisdictions')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
export class JurisdictionsController {
  constructor(private service: JurisdictionsService) {}

  @Get()
  findAll(@Request() req: { user: AuthUser }) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
