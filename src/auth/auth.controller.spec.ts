import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateOAuthLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.validateOAuthLogin and return access token', async () => {
      const mockToken = { access_token: 'mocked-jwt-token' };
      const mockIdToken = 'mock-id-token';

      (authService.validateOAuthLogin as jest.Mock).mockResolvedValueOnce(mockToken);

      const result = await authController.login({ idToken: mockIdToken });

      expect(authService.validateOAuthLogin).toHaveBeenCalledWith(mockIdToken);
      expect(result).toEqual(mockToken);
    });
  });
});
