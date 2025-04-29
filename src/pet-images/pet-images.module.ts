import { Module } from '@nestjs/common';
import { PetImagesService } from './pet-images.service';
import { PetImagesController } from './pet-images.controller';
import { PrismaService } from '../shared/prisma/prisma.service';

@Module({
  controllers: [PetImagesController],
  providers: [PetImagesService, PrismaService],
})
export class PetImagesModule {}
