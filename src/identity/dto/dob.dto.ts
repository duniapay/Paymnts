import { IsNotEmpty, IsString } from 'class-validator';

export class DayOfBirthDto {
  @IsNotEmpty()
  @IsString()
  day: string;
  @IsNotEmpty()
  @IsString()
  month: string;
  @IsNotEmpty()
  @IsString()
  year: string;
}
