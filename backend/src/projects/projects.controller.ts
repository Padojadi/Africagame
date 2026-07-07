import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Roles } from '../common/decorators';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Tous les projets (admin)' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('mine')
  @ApiOperation({ summary: 'Mes projets' })
  findMine(@Request() req: { user: { id: string } }) {
    return this.projectsService.findMine(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail projet' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Soumettre un projet' })
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un projet' })
  update(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: Role } },
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, req.user.id, req.user.role, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un projet' })
  remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: Role } },
  ) {
    return this.projectsService.remove(id, req.user.id, req.user.role);
  }
}
