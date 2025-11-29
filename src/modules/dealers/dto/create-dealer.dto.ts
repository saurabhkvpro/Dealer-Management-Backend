import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateDealerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  operatingHours: string;

  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  region: string;
}
