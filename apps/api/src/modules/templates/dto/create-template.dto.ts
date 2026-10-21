import { IsString, IsOptional, IsEnum, IsInt, Min, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum TemplateLanguage {
  AMHARIC = 'AMHARIC',
  ENGLISH = 'ENGLISH',
  BILINGUAL = 'BILINGUAL',
}

export class CreateTemplateDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  category!: string;

  @IsEnum(TemplateLanguage)
  language!: TemplateLanguage;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  priceMinor: number = 0;

  @IsString()
  @IsOptional()
  thumbnailKey?: string;

  @IsObject()
  content!: any;

  // Placeholder keys can be sent by client but will be ignored
  // Keys are always derived from content by the service
  @IsArray()
  @IsOptional()
  placeholderKeys?: string[];
}
