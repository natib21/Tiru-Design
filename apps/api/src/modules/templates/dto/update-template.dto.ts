import { IsString, IsOptional, IsEnum, IsInt, Min, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateLanguage } from './create-template.dto';

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TemplateLanguage)
  @IsOptional()
  language?: TemplateLanguage;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  priceMinor?: number;

  @IsString()
  @IsOptional()
  thumbnailKey?: string;

  @IsObject()
  @IsOptional()
  content?: any;

  // Placeholder keys can be sent by client but will be ignored
  // Keys are always derived from content by the service
  @IsArray()
  @IsOptional()
  placeholderKeys?: string[];
}
