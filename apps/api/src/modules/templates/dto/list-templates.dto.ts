import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TemplateLanguage } from './create-template.dto';

export class ListTemplatesDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TemplateLanguage)
  @IsOptional()
  language?: TemplateLanguage;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  freeOnly?: boolean;

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  cursor?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}
