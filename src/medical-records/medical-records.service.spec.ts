import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsService } from './medical-records.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordTypes } from '@prisma/client';

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalRecordsService,
        {
          provide: PrismaService,
          useValue: {
            medicalRecord: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call Prisma medicalRecord.create with correct data', async () => {
      const createDto: CreateMedicalRecordDto = {
        petId: 1,
        title: 'Cold vaccine',
        type: MedicalRecordTypes.VACCINE,
        description: 'A regular cold vaccine',
        imageBase64: 'base64-image-string',
        date: new Date('2025-03-10').toISOString(),
      };

      const expectedCreatedRecord = {
        id: 1,
        ...createDto,
      };

      (prisma.medicalRecord.create as jest.Mock).mockResolvedValue(expectedCreatedRecord);

      const result = await service.create(createDto);

      expect(prisma.medicalRecord.create).toHaveBeenCalledWith({
        data: createDto,
      });

      expect(result).toEqual(expectedCreatedRecord);
    });
  });
});
