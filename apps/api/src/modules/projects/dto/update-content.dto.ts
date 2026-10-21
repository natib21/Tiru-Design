import { IsInt, IsObject, IsNotEmpty, Min } from 'class-validator';

export class UpdateContentDto {
  @IsInt()
  @Min(1)
  version!: number;

  @IsObject()
  @IsNotEmpty()
  content!: any; // Will be validated by Zod schema
}
