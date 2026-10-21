import { IsString, IsOptional, IsObject, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsObject()
  content?: any; // Will be validated by Zod schema
}
