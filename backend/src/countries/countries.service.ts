import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.country.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
