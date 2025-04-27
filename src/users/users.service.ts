import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, sub, image } = createUserDto;

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { sub },
    });

    // If user doesn't exist, create it
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          sub,
          name,
          image: image,
        },
      });
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const where = { id };
    const user = await this.prisma.user.update({ where, data: updateUserDto });

    return user;
  }
}
