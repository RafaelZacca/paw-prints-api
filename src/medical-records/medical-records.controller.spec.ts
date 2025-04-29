import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { MedicalRecordTypes } from '@prisma/client';

describe('MedicalRecordsController', () => {
  let controller: MedicalRecordsController;
  let service: MedicalRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalRecordsController],
      providers: [
        {
          provide: MedicalRecordsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MedicalRecordsController>(MedicalRecordsController);
    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call MedicalRecordsService.create with correct dto', async () => {
      const createDto: CreateMedicalRecordDto = {
        petId: 1,
        title: 'Cold vaccine',
        type: MedicalRecordTypes.VACCINE,
        description: 'A regular cold vaccine',
        date: new Date('2025-03-10').toISOString(),
        imageBase64: 'base64-image-string',
      };

      const expectedResult = { id: 123, ...createDto };

      (service.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
