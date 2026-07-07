import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Public, Roles } from '../common/decorators';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des formations' })
  findAll(@Query('published') published?: string) {
    return this.coursesService.findAll(published === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail formation' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR, Role.MENTOR)
  @ApiOperation({ summary: 'Créer une formation (admin)' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR, Role.MENTOR)
  @ApiOperation({ summary: 'Modifier une formation (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une formation (admin)' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
