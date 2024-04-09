import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {

  let authController: AuthController;
  let authService: AuthService;

  const mockUser = {
    _id: '66055c6cb087d44015b917b4',
    'name': 'John',
    'email': 'jhon@example.com',
    'password': 'hashedPassword'
  };

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn()
  };

  const token = 'jwtToken';

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {


    it('should register a new user', async () => {
      jest.spyOn(authService, 'signUp').mockResolvedValue({ token: token });

      const result = await authController.signUp(mockUser as SignupDto);

      expect(authService.signUp).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: token });
    });
  });

  describe('login', () => {

    it('should login a user', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue({ token: token });

      const result = await authController.login(mockUser as LoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: token });
    });
  });
});
