import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePetImageDto {
  @IsInt()
  petId: number;

  @IsString()
  @IsNotEmpty()
  imageBase64: string;
}
