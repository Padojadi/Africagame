import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { HackathonsService } from './hackathons.service';
import { CreateHackathonDto, UpdateHackathonDto } from './dto/hackathon.dto';
import { Public, Roles } from '../common/decorators';

@ApiTags('hackathons')
@Controller('hackathons')
export class HackathonsController {
  constructor(private hackathonsService: HackathonsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des hackathons' })
  findAll() {
    return this.hackathonsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail hackathon' })
  findOne(@Param('id') id: string) {
    return this.hackathonsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Créer un hackathon (admin)' })
  create(@Body() dto: CreateHackathonDto) {
    return this.hackathonsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Modifier un hackathon (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateHackathonDto) {
    return this.hackathonsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un hackathon (admin)' })
  remove(@Param('id') id: string) {
    return this.hackathonsService.remove(id);
  }
}
