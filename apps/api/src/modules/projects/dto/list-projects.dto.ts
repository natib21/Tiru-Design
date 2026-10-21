import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProjectsDto {
  @IsOptional()
  @IsString()
  cursor?: string; // Project ID for cursor-based pagination

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20; // Default limit
}
