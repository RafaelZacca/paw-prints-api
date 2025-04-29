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
  };

  const mockResponse = {
    redirect: jest.fn(),
  };

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
    process.env.PLATFORM = 'mobile';
    process.env.MOBILE_REDIRECT_URL = 'pawprints';

    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    await controller.googleAuthRedirect(mockRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mockRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('pawprints://callback?token=test-token');
  });

  it('should redirect to web callback page if platform is web', async () => {
    process.env.PLATFORM = 'web';
    process.env.WEB_REDIRECT_URL = 'http://localhost:4200';

    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    await controller.googleAuthRedirect(mockRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mockRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:4200/auth/callback?token=test-token');
  });

  it('should default to web callback page if platform is undefined', async () => {
    delete process.env.PLATFORM; // simulate missing env
    process.env.WEB_REDIRECT_URL = 'http://localhost:4200';

    mockAuthService.googleLogin.mockResolvedValue({ access_token: 'test-token' });

    await controller.googleAuthRedirect(mockRequest as any, mockResponse as any);

    expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mockRequest.user);
    expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:4200/auth/callback?token=test-token');
  });
});
