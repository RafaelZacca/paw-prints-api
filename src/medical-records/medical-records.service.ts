import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalRecordTypes } from '@prisma/client';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const data = {
      ...createMedicalRecordDto,
      date: new Date(createMedicalRecordDto.date).toISOString(),
      type: createMedicalRecordDto.type.toUpperCase() as MedicalRecordTypes,
      petId: parseInt(createMedicalRecordDto.petId.toString()),
    };
    return this.prisma.medicalRecord.create({
      data,
    });
  }
}
