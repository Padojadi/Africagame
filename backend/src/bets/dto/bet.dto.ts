import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel, BetNature, GameType } from '@prisma/client';

export class DeclareBetDto {
  @ApiProperty({ enum: BetNature })
  @IsEnum(BetNature)
  nature: BetNature;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: Channel })
  @IsEnum(Channel)
  channel: Channel;

  @ApiProperty({ enum: GameType })
  @IsEnum(GameType)
  gameType: GameType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  msisdn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorRef?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class DeclareBetBatchDto {
  @ApiProperty({ type: [DeclareBetDto] })
  bets: DeclareBetDto[];
}
