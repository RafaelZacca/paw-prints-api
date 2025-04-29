import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetGender, PetTypes } from '@prisma/client';

describe('PetsService', () => {
  let service: PetsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: PrismaService,
          useValue: {
            pet: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.pet.create with correct data', async () => {
      const createDto: CreatePetDto = {
        name: 'Lucky',
        description: 'A friendly dog',
        type: PetTypes.DOG,
        breed: 'Labradoodle',
        birthDate: new Date('2022-05-01').toISOString(),
        gender: PetGender.MALE,
        location: 'Salta Capital, Salta',
        userId: 1,
      };

      const expectedCreatedPet = { id: 1, ...createDto };

      (prisma.pet.create as jest.Mock).mockResolvedValue(expectedCreatedPet);

      const result = await service.create(createDto);

      expect(prisma.pet.create).toHaveBeenCalledWith({
        data: createDto,
      });

      expect(result).toEqual(expectedCreatedPet);
    });
  });

  describe('findAll', () => {
    it('should call prisma.pet.findMany and return all pets', async () => {
      const expectedPets = [
        { id: 1, name: 'Lucky', type: PetTypes.DOG, images: [], medicalRecords: [] },
        { id: 2, name: 'Max', type: PetTypes.CAT, images: [], medicalRecords: [] },
      ];

      (prisma.pet.findMany as jest.Mock).mockResolvedValue(expectedPets);

      const result = await service.findAll();

      expect(prisma.pet.findMany).toHaveBeenCalledWith({
        include: { images: true, medicalRecords: true },
      });

      expect(result).toEqual(expectedPets);
    });
  });

  describe('findOne', () => {
    it('should call prisma.pet.findUnique with correct id and include relations', async () => {
      const expectedPet = {
        id: 1,
        name: 'Lucky',
        type: PetTypes.DOG,
        images: [],
        medicalRecords: [],
      };

      (prisma.pet.findUnique as jest.Mock).mockResolvedValue(expectedPet);

      const result = await service.findOne(1);

      expect(prisma.pet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { images: true, medicalRecords: true },
      });

      expect(result).toEqual(expectedPet);
    });
  });
});
