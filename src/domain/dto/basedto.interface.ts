import { IsOptional } from 'class-validator';

export class BaseDTO {
  @IsOptional()
  id: string;
  @IsOptional()
  created_at: Date;
  @IsOptional()
  updated_at: Date;
}
