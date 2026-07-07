import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { Roles } from '../common/decorators';

@ApiTags('audit')
@ApiBearerAuth()
@Controller('audit')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get()
  findAll() {
    return this.audit.findAll({ limit: 200 });
  }
}
