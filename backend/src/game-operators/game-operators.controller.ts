import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GameOperatorsService } from './game-operators.service';
import { Roles, AuthUser } from '../common/decorators';

@ApiTags('game-operators')
@ApiBearerAuth()
@Controller('game-operators')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR, UserRole.OPERATEUR)
export class GameOperatorsController {
  constructor(private service: GameOperatorsService) {}

  @Get()
  findAll(@Request() req: { user: AuthUser }) {
    return this.service.findAll(req.user);
  }
}
