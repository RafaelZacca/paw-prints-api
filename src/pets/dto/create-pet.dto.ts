import { PetGender, PetTypes } from '@prisma/client';
import { IsString, IsDateString, IsNotEmpty, IsInt } from 'class-validator';

export class CreatePetDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: PetTypes;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  gender: PetGender;

  @IsString()
  @IsNotEmpty()
  location: string;
}
