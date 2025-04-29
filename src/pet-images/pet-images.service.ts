import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePetImageDto } from './dto/create-pet-image.dto';
import { PetImage } from './entities/pet-image.entity';

@Injectable()
export class PetImagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPetImageDto: CreatePetImageDto): Promise<PetImage> {
    const imagesForPet = await this.prisma.petImage.findMany({
      where: { petId: createPetImageDto.petId },
    });

    const isFirstImage = imagesForPet.length === 0;

    return this.prisma.petImage.create({
      data: {
        petId: createPetImageDto.petId,
        imageBase64: createPetImageDto.imageBase64,
        isDefault: isFirstImage,
      },
    });
  }
}
