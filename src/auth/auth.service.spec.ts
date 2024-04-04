import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  const mockUser = {
    _id: '66055c6cb087d44015b917b4',
    'name': 'John',
    'email': 'jhon@example.com',
    'password': 'hashedPassword'
  };

  const token = 'jwtToken';

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn()
  };


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'John',
        email: 'jhon@example.com',
        password: 'password'
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser as any));
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(newUser);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(model.create).toHaveBeenCalledWith({ ...newUser, password: 'hashedPassword' });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token });
    });
  });

  describe('login', () => {
    it('should login user and return a token', async () => {
      const loginUser = {
        email: 'jhon@example.com',
        password: 'password'
      };

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.login(loginUser);

      expect(model.findOne).toHaveBeenCalledWith({ email: loginUser.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUser.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token });
    });

    it('should throw an error if user does not exist', async () => {
      const wrongUser = {
        email: 'wrong@example.com'
      };

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      const login = () => authService.login(wrongUser as LoginDto);

      await expect(login).rejects.toThrow(UnauthorizedException);
      await expect(login).rejects.toThrow('Invalid credentials');
      expect(model.findOne).toHaveBeenCalledWith({ email: wrongUser.email });
    });

    it('should throw an error if password is incorrect', async () => {
      const loginUser = {
        email: 'jhon@example.com',
        password: 'incorrectPassword'
      };

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const login = () => authService.login(loginUser as LoginDto);

      await expect(login).rejects.toThrow(UnauthorizedException);
      await expect(login).rejects.toThrow('Invalid credentials');
      expect(model.findOne).toHaveBeenCalledWith({ email: loginUser.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUser.password, mockUser.password);
    });
  });

});
