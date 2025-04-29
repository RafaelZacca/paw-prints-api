import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { Pet } from './entities/pet.entity';
import { PetGender, PetTypes } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  create(createPetDto: CreatePetDto): Promise<Pet> {
    const data = {
      ...createPetDto,
      birthDate: new Date(createPetDto.birthDate).toISOString(),
      gender: createPetDto.gender.toUpperCase() as PetGender,
      type: createPetDto.type.toUpperCase() as PetTypes,
      userId: parseInt(createPetDto.userId.toString()),
    };
    return this.prisma.pet.create({
      data,
    });
  }

  findAll(): Promise<Pet[]> {
    return this.prisma.pet.findMany({
      include: { images: true, medicalRecords: true },
    });
  }

  findOne(id: number): Promise<Pet | null> {
    return this.prisma.pet.findUnique({
      where: { id },
      include: { images: true, medicalRecords: true },
    });
  }
}
