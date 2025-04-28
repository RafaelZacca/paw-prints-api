import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: mockJwtService }, { provide: UsersService, useValue: mockUsersService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should create user if needed and return signed JWT', async () => {
    const googleUser = {
      email: 'test@example.com',
      sub: 'google12345',
      name: 'Test User',
      picture: 'http://example.com/picture.jpg',
    };

    const mockCreatedUser = {
      id: 1,
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
    };

    mockUsersService.create.mockResolvedValue(mockCreatedUser);
    mockJwtService.sign.mockReturnValue('mocked-jwt-token');

    const result = await service.googleLogin(googleUser);

    expect(usersService.create).toHaveBeenCalledWith({
      email: googleUser.email,
      sub: googleUser.sub,
      name: googleUser.name,
      image: googleUser.picture,
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      userId: mockCreatedUser.id,
      email: mockCreatedUser.email,
    });

    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
  });

  it('should generate username from email if name is missing', async () => {
    const googleUserWithoutName = {
      email: 'someone@example.com',
      sub: 'google67890',
      name: undefined,
      picture: 'http://example.com/pic.jpg',
    };

    const mockCreatedUser = {
      id: 2,
      email: googleUserWithoutName.email,
      name: 'someone',
      image: googleUserWithoutName.picture,
    };

    mockUsersService.create.mockResolvedValue(mockCreatedUser);
    mockJwtService.sign.mockReturnValue('mocked-jwt-token-2');

    const result = await service.googleLogin(googleUserWithoutName);

    expect(usersService.create).toHaveBeenCalledWith({
      email: googleUserWithoutName.email,
      sub: googleUserWithoutName.sub,
      name: 'someone',
      image: googleUserWithoutName.picture,
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      userId: mockCreatedUser.id,
      email: mockCreatedUser.email,
    });

    expect(result).toEqual({ access_token: 'mocked-jwt-token-2' });
  });
});
