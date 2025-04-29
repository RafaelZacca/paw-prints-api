import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }
}
