import { PetGender, PetTypes } from '@prisma/client';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';
import { PetImage } from '../../pet-images/entities/pet-image.entity';

export class Pet {
  id: number;
  name: string;
  type: PetTypes;
  breed: string;
  birthDate: Date;
  gender: PetGender;
  location: string;
  medicalRecords?: MedicalRecord[];
  images?: PetImage[];
}
