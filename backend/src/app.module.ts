import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JurisdictionsModule } from './jurisdictions/jurisdictions.module';
import { GameOperatorsModule } from './game-operators/game-operators.module';
import { PaymentsModule } from './payments/payments.module';
import { BetsModule } from './bets/bets.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { ReportingModule } from './reporting/reporting.module';
import { ChannelsModule } from './channels/channels.module';
import { ResponsibleGamingModule } from './responsible-gaming/responsible-gaming.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JurisdictionsModule,
    GameOperatorsModule,
    PaymentsModule,
    BetsModule,
    FiscalModule,
    ReportingModule,
    ChannelsModule,
    ResponsibleGamingModule,
    AuditModule,
  ],
})
export class AppModule {}
