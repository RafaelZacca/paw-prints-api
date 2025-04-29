import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
    return { ...user, petQuantity: 0 };
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        pets: true,
      },
    });

    return user ? { ...user, petQuantity: user.pets?.length || 0 } : null;
  }
}
