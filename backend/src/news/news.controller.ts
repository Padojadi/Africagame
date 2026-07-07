import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { Public, Roles } from '../common/decorators';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des actualités' })
  findAll(@Query('published') published?: string) {
    return this.newsService.findAll(published === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail actualité' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Créer une actualité (admin)' })
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateNewsDto,
  ) {
    return this.newsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Modifier une actualité (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer une actualité (admin)' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
