import { MedicalRecordTypes } from '@prisma/client';

export class MedicalRecord {
  id: number;
  title: string;
  type: MedicalRecordTypes;
  description: string;
  date: Date;
  imageBase64: string | null;
}
