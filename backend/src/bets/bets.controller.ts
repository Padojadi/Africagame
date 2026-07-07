import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { BetsService } from './bets.service';
import { DeclareBetDto, DeclareBetBatchDto } from './dto/bet.dto';
import { Roles, ApiKeyAuth, AuthUser } from '../common/decorators';

@ApiTags('bets')
@Controller('bets')
export class BetsController {
  constructor(private service: BetsService) {}

  @Post('declare')
  @ApiKeyAuth()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Monitoring — Déclarer un pari (API opérateur)' })
  declare(@Request() req: { operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } } }, @Body() dto: DeclareBetDto) {
    return this.service.declare(req.operator, dto);
  }

  @Post('declare/batch')
  @ApiKeyAuth()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Déclaration par lot' })
  declareBatch(@Request() req: { operator: { id: string; jurisdictionId: string; jurisdiction: { currency: { code: string } } } }, @Body() dto: DeclareBetBatchDto) {
    return this.service.declareBatch(req.operator, dto.bets);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
  findAll(
    @Request() req: { user: AuthUser },
    @Query('channel') channel?: string,
    @Query('gameType') gameType?: string,
  ) {
    return this.service.findAll(req.user, { channel, gameType });
  }

  @Get('pbj')
  @ApiBearerAuth()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  getPbj(@Request() req: { user: AuthUser }) {
    return this.service.getPbj(req.user);
  }

  @Get('stats')
  @ApiBearerAuth()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  stats(@Request() req: { user: AuthUser }) {
    return this.service.getStatsByChannel(req.user);
  }
}
