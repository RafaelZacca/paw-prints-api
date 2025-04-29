import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user if not found', async () => {
      const dto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        sub: '123456',
        image: 'test.png',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      (prisma.user.create as jest.Mock).mockResolvedValueOnce({ ...dto, id: 1 });

      const result = await service.create(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { sub: dto.sub } });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          sub: dto.sub,
          name: dto.name,
          image: dto.image,
        },
      });
      expect(result).toEqual({ ...dto, id: 1, petQuantity: 0 });
    });

    it('should return existing user if found', async () => {
      const existingUser = {
        id: 1,
        name: 'Existing User',
        email: 'existing@example.com',
        sub: '654321',
        image: 'existing.png',
        petQuantity: 0,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(existingUser);

      const result = await service.create({
        name: existingUser.name,
        email: existingUser.email,
        sub: existingUser.sub,
        image: existingUser.image,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { sub: existingUser.sub } });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com', sub: '123', image: 'test.png', petQuantity: 0 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.findOne(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ include: { pets: true }, where: { id: 1 } });
      expect(result).toEqual(user);
    });
  });
});
