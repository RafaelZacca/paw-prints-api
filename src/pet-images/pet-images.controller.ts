import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PetImagesService } from './pet-images.service';
import { CreatePetImageDto } from './dto/create-pet-image.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pet-images')
export class PetImagesController {
  constructor(private readonly petImagesService: PetImagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPetImageDto: CreatePetImageDto) {
    return this.petImagesService.create(createPetImageDto);
  }
}
