import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    googleLogin: jest.fn(),
  };

  const mockRequest = {
    user: { email: 'test@example.com', providerId: '12345' },
    query: {},
  };

  const mockResponse = {
    redirect: jest.fn(),
  };

  beforeAll(() => {
    process.env.MOBILE_REDIRECT_URL = 'pawprints';
    process.env.WEB_REDIRECT_URL = 'http://localhost:4200';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AuthGuard('google'))
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should redirect to mobile deep link if platform is mobile', async () => {
    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    const mobileRequest = {
      ...mockRequest,
      query: { platform: 'mobile' },
    };

    await controller.googleAuthRedirect(mobileRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mobileRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('pawprints://callback?token=test-token');
  });

  it('should redirect to web callback page if platform is web', async () => {
    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    const webRequest = {
      ...mockRequest,
      query: { platform: 'web' },
    };

    await controller.googleAuthRedirect(webRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(webRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:4200/auth/callback?token=test-token');
  });

  it('should default to web callback if no platform is specified', async () => {
    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    const defaultRequest = {
      ...mockRequest,
      query: {},
    };

    await controller.googleAuthRedirect(defaultRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(defaultRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:4200/auth/callback?token=test-token');
  });
});
