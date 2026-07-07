import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private sanitize<T extends { password?: string }>(user: T) {
    const { password: _, ...rest } = user;
    return rest;
  }

  findAll() {
    return this.prisma.user
      .findMany({ include: { country: true }, orderBy: { createdAt: 'desc' } })
      .then((users) => users.map((u) => this.sanitize(u)));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { country: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return this.sanitize(user);
  }

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        age: dto.age,
        phone: dto.phone,
        countryId: dto.countryId,
        role: (dto.role as Role) || 'PARTICIPANT',
      },
      include: { country: true },
    });
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }
    if (dto.role) data.role = dto.role as Role;
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { country: true },
    });
    return this.sanitize(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Utilisateur supprimé' };
  }
}
