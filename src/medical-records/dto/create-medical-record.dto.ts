import { MedicalRecordTypes } from '@prisma/client';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsInt()
  @IsNotEmpty()
  petId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: MedicalRecordTypes;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  imageBase64?: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}
