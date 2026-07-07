import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { ProjectsModule } from './projects/projects.module';
import { HackathonsModule } from './hackathons/hackathons.module';
import { CoursesModule } from './courses/courses.module';
import { NewsModule } from './news/news.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    ProjectsModule,
    HackathonsModule,
    CoursesModule,
    NewsModule,
    StatsModule,
  ],
})
export class AppModule {}
