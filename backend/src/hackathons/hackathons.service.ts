import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHackathonDto, UpdateHackathonDto } from './dto/hackathon.dto';
import { HackathonStatus } from '@prisma/client';

@Injectable()
export class HackathonsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.hackathon.findMany({
      include: { country: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      include: { country: true },
    });
    if (!hackathon) throw new NotFoundException('Hackathon introuvable');
    return hackathon;
  }

  create(dto: CreateHackathonDto) {
    return this.prisma.hackathon.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        maxTeams: dto.maxTeams ?? 10,
        quotaPerCountry: dto.quotaPerCountry ?? 5,
        countryId: dto.countryId,
        status: (dto.status as HackathonStatus) || 'UPCOMING',
      },
      include: { country: true },
    });
  }

  async update(id: string, dto: UpdateHackathonDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.status) data.status = dto.status as HackathonStatus;
    return this.prisma.hackathon.update({
      where: { id },
      data,
      include: { country: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.hackathon.delete({ where: { id } });
    return { message: 'Hackathon supprimé' };
  }
}
