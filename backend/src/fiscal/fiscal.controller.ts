import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FiscalService } from './fiscal.service';
import { Roles, AuthUser } from '../common/decorators';

@ApiTags('fiscal')
@ApiBearerAuth()
@Controller('fiscal')
export class FiscalController {
  constructor(private service: FiscalService) {}

  @Get('invoices')
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
  invoices(@Request() req: { user: AuthUser }) {
    return this.service.findInvoices(req.user);
  }

  @Get('rules/:jurisdictionId')
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  rules(@Param('jurisdictionId') jurisdictionId: string) {
    return this.service.getRules(jurisdictionId);
  }

  @Post('calculate')
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  @ApiOperation({ summary: 'Calculer prélèvements PBJ pour une période' })
  calculate(
    @Body() body: { jurisdictionId: string; gameOperatorId: string; periodStart: string; periodEnd: string },
  ) {
    return this.service.calculateLevy(
      body.jurisdictionId,
      body.gameOperatorId,
      new Date(body.periodStart),
      new Date(body.periodEnd),
    );
  }
}
