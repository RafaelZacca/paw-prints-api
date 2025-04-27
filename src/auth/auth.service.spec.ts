import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client, LoginTicket } from 'google-auth-library';

process.env.GOOGLE_CLIENT_ID = 'mock-google-client-id';

// Mock google-auth-library's OAuth2Client
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn(),
    })),
  };
});

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let oauthClient: jest.Mocked<OAuth2Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);

    // Capture the internally created OAuth2Client instance
    oauthClient = (authService as any).client;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateOAuthLogin', () => {
    it('should throw an error if payload is missing email or sub', async () => {
      (oauthClient.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        getPayload: () => ({ email: null, sub: null }),
      } as unknown as LoginTicket);

      await expect(authService.validateOAuthLogin('fake-id-token')).rejects.toThrow('Missing email or sub in payload');
    });

    it('should create user, sign token and return it', async () => {
      const payload = {
        email: 'test@example.com',
        sub: '123456',
        name: 'Test User',
        picture: 'test.png',
      };

      const mockUser = {
        id: 1,
        email: payload.email,
        sub: payload.sub,
        name: payload.name,
        image: payload.picture,
      };

      (oauthClient.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        getPayload: () => payload,
      } as unknown as LoginTicket);

      (usersService.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authService.validateOAuthLogin('fake-id-token');

      expect(oauthClient.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'fake-id-token',
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      expect(usersService.create).toHaveBeenCalledWith({
        email: payload.email,
        sub: payload.sub,
        name: payload.name,
        image: payload.picture,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });

    it('should fallback to email username if name is missing', async () => {
      const payload = {
        email: 'no-name@example.com',
        sub: '654321',
        name: undefined,
        picture: 'no-name.png',
      };

      const mockUser = {
        id: 2,
        email: payload.email,
        sub: payload.sub,
        name: 'no-name', // <- important
        image: payload.picture,
      };

      (oauthClient.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        getPayload: () => payload,
      } as unknown as LoginTicket);

      (usersService.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authService.validateOAuthLogin('fake-id-token');

      expect(usersService.create).toHaveBeenCalledWith({
        email: payload.email,
        sub: payload.sub,
        name: 'no-name', // fallback to email prefix
        image: payload.picture,
      });

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });
});
