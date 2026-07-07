import { Controller, Get, Post, Patch, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { Roles } from '../common/decorators';
import { AuthUser } from '../common/decorators';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Request() req: { user: AuthUser }) {
    return this.usersService.findAll(req.user);
  }

  @Post()
  @Roles(UserRole.EXPLOITANT, UserRole.REGULATEUR)
  create(@Request() req: { user: AuthUser }, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user, dto);
  }

  @Patch(':id')
  update(@Request() req: { user: AuthUser }, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.EXPLOITANT)
  remove(@Request() req: { user: AuthUser }, @Param('id') id: string) {
    return this.usersService.remove(req.user, id);
  }
}
