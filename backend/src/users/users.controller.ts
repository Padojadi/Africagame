import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { Roles } from '../common/decorators';
import { AdminGuard } from '../common/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Roles(Role.ADMIN, Role.MODERATOR)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des utilisateurs (admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail utilisateur' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer un utilisateur (admin)' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un utilisateur (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur (admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
