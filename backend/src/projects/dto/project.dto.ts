import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description du projet (max 500 mots recommandé)' })
  @IsString()
  @MinLength(50)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heritage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryId?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heritage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryId?: string;
}
