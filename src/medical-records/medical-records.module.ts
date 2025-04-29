import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { PrismaService } from '../shared/prisma/prisma.service';

@Module({
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, PrismaService],
})
export class MedicalRecordsModule {}
