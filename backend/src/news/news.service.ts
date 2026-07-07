import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  findAll(publishedOnly = false) {
    return this.prisma.news.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.news.findUnique({
      where: { id },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!item) throw new NotFoundException('Actualité introuvable');
    return item;
  }

  create(authorId: string, dto: CreateNewsDto) {
    return this.prisma.news.create({
      data: { ...dto, authorId },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);
    return this.prisma.news.update({
      where: { id },
      data: dto,
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.news.delete({ where: { id } });
    return { message: 'Actualité supprimée' };
  }
}
