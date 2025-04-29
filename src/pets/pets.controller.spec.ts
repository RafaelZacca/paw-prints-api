import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthGuard } from '@nestjs/passport';
import { PetGender, PetTypes } from '@prisma/client';

describe('PetsController', () => {
  let controller: PetsController;
  let service: PetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        {
          provide: PetsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true }) // ✅ Bypass AuthGuard
      .compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PetsService.create with correct dto', async () => {
      const createDto: CreatePetDto = {
        name: 'Lucky',
        description: 'A friendly dog',
        type: PetTypes.DOG,
        breed: 'Labradoodle',
        birthDate: '2022-05-01',
        gender: PetGender.MALE,
        location: 'Salta Capital, Salta',
        userId: 1,
      };

      const expectedCreatedPet = { id: 1, ...createDto };

      (service.create as jest.Mock).mockResolvedValue(expectedCreatedPet);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedCreatedPet);
    });
  });

  describe('findAll', () => {
    it('should call PetsService.findAll and return all pets', async () => {
      const expectedPets = [
        { id: 1, name: 'Lucky', type: PetTypes.DOG },
        { id: 2, name: 'Max', type: PetTypes.CAT },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(expectedPets);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedPets);
    });
  });

  describe('findOne', () => {
    it('should call PetsService.findOne with correct id', async () => {
      const expectedPet = { id: 1, name: 'Lucky', type: PetTypes.DOG };

      (service.findOne as jest.Mock).mockResolvedValue(expectedPet);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedPet);
    });
  });
});
