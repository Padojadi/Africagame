import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectStatus, Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      include: { author: { select: { id: true, firstName: true, lastName: true, email: true } }, country: true, team: { include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findMine(userId: string) {
    return this.prisma.project.findMany({
      where: { authorId: userId },
      include: { country: true, team: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
        country: true,
        team: { include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } } },
      },
    });
    if (!project) throw new NotFoundException('Projet introuvable');
    return project;
  }

  create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        heritage: dto.heritage,
        countryId: dto.countryId,
        authorId: userId,
        status: 'DRAFT',
      },
      include: { country: true },
    });
  }

  async update(id: string, userId: string, role: Role, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (project.authorId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
      throw new ForbiddenException('Modification non autorisée');
    }
    const data: Record<string, unknown> = { ...dto };
    if (dto.status && role !== 'ADMIN' && role !== 'MODERATOR') {
      delete data.status;
    }
    if (dto.status) data.status = dto.status as ProjectStatus;
    return this.prisma.project.update({
      where: { id },
      data,
      include: { country: true },
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const project = await this.findOne(id);
    if (project.authorId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Suppression non autorisée');
    }
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Projet supprimé' };
  }
}
