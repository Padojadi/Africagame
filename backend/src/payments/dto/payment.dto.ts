import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel, PaymentNature } from '@prisma/client';

export class InitiatePaymentDto {
  @ApiProperty({ enum: PaymentNature })
  @IsEnum(PaymentNature)
  nature: PaymentNature;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: Channel })
  @IsEnum(Channel)
  channel: Channel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  msisdn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorRef?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ description: 'Clé d\'idempotence obligatoire pour USSD/SMS' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class PaymentWebhookDto {
  @ApiProperty()
  @IsString()
  transactionId: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  payload?: Record<string, unknown>;
}
