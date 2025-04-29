import { Test, TestingModule } from '@nestjs/testing';
import { PetImagesService } from './pet-images.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePetImageDto } from './dto/create-pet-image.dto';

describe('PetImagesService', () => {
  let service: PetImagesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetImagesService,
        {
          provide: PrismaService,
          useValue: {
            petImage: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PetImagesService>(PetImagesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should set isDefault to true when it is the first image for the pet', async () => {
      const createDto: CreatePetImageDto = {
        petId: 1,
        imageBase64: 'base64-image-string',
      };

      // No existing images found
      (prisma.petImage.findMany as jest.Mock).mockResolvedValue([]);

      const expectedCreatedImage = {
        id: 1,
        petId: createDto.petId,
        imageBase64: createDto.imageBase64,
        isDefault: true,
      };

      (prisma.petImage.create as jest.Mock).mockResolvedValue(expectedCreatedImage);

      const result = await service.create(createDto);

      expect(prisma.petImage.findMany).toHaveBeenCalledWith({
        where: { petId: createDto.petId },
      });

      expect(prisma.petImage.create).toHaveBeenCalledWith({
        data: {
          petId: createDto.petId,
          imageBase64: createDto.imageBase64,
          isDefault: true,
        },
      });

      expect(result).toEqual(expectedCreatedImage);
    });

    it('should set isDefault to false when there are already images for the pet', async () => {
      const createDto: CreatePetImageDto = {
        petId: 2,
        imageBase64: 'another-base64-string',
      };

      // Already has images
      (prisma.petImage.findMany as jest.Mock).mockResolvedValue([{ id: 99, petId: 2, imageBase64: 'some-other-image', isDefault: true }]);

      const expectedCreatedImage = {
        id: 2,
        petId: createDto.petId,
        imageBase64: createDto.imageBase64,
        isDefault: false,
      };

      (prisma.petImage.create as jest.Mock).mockResolvedValue(expectedCreatedImage);

      const result = await service.create(createDto);

      expect(prisma.petImage.findMany).toHaveBeenCalledWith({
        where: { petId: createDto.petId },
      });

      expect(prisma.petImage.create).toHaveBeenCalledWith({
        data: {
          petId: createDto.petId,
          imageBase64: createDto.imageBase64,
          isDefault: false,
        },
      });

      expect(result).toEqual(expectedCreatedImage);
    });
  });
});
