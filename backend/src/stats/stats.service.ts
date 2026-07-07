import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [users, projects, hackathons, courses, countries, news] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.hackathon.count(),
      this.prisma.course.count({ where: { published: true } }),
      this.prisma.country.count({ where: { active: true } }),
      this.prisma.news.count({ where: { published: true } }),
    ]);

    const projectsByStatus = await this.prisma.project.groupBy({
      by: ['status'],
      _count: true,
    });

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    return {
      totals: { users, projects, hackathons, courses, countries, news },
      projectsByStatus,
      usersByRole,
    };
  }
}
