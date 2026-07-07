import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { Public } from '../common/decorators';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private service: ChannelsService) {}

  @Public()
  @Post('ussd/session')
  @ApiOperation({ summary: 'Créer session USSD (multi-étapes)' })
  createUssd(@Body() body: { msisdn: string; jurisdictionId: string; gameOperatorId?: string }) {
    return this.service.createUssdSession(body);
  }

  @Public()
  @Post('sms/inbound')
  @ApiOperation({ summary: 'Réception SMS (idempotent)' })
  smsInbound(@Body() body: { messageId: string; msisdn: string; jurisdictionId: string; body: string; keyword?: string }) {
    return this.service.processSms(body);
  }

  @Get('ussd/sessions')
  @ApiOperation({ summary: 'Sessions USSD actives' })
  sessions(@Query('jurisdictionId') jurisdictionId?: string) {
    return this.service.getActiveSessions(jurisdictionId);
  }
}
