import { Test, TestingModule } from '@nestjs/testing';
import { PetImagesController } from './pet-images.controller';
import { PetImagesService } from './pet-images.service';
import { CreatePetImageDto } from './dto/create-pet-image.dto';
import { AuthGuard } from '@nestjs/passport';

describe('PetImagesController', () => {
  let controller: PetImagesController;
  let service: PetImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetImagesController],
      providers: [
        {
          provide: PetImagesService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PetImagesController>(PetImagesController);
    service = module.get<PetImagesService>(PetImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PetImagesService.create with correct dto', async () => {
      const createDto: CreatePetImageDto = {
        petId: 1,
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
