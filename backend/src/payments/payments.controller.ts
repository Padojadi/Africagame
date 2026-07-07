import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/payment.dto';
import { Roles, ApiKeyAuth, Public, AuthUser } from '../common/decorators';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Post('initiate')
  @ApiKeyAuth()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Concentrateur — Initier un paiement (API opérateur)' })
  initiate(@Request() req: { operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } } }, @Body() dto: InitiatePaymentDto) {
    return this.service.initiate(req.operator, dto);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Callback asynchrone statut paiement' })
  webhook(@Body() dto: PaymentWebhookDto) {
    return this.service.webhook(dto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
  findAll(
    @Request() req: { user: AuthUser },
    @Query('channel') channel?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(req.user, { channel, status });
  }

  @Get('stats')
  @ApiBearerAuth()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  stats(@Request() req: { user: AuthUser }) {
    return this.service.getStats(req.user);
  }
}
