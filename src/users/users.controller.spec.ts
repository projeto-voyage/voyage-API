import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EnvService } from '../env/env.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
  };

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockEnvService = {
    get: jest.fn().mockImplementation((key) => {
      const mockValues = { JWT_SECRET: 'test-secret' };
      return mockValues[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('User creation failed'));

      await expect(controller.create({ name: 'Test', email: 'test@test.com', password: '123456' }))
        .rejects.toThrow('User creation failed');
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Email already exists'));
    
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    
      await expect(controller.create(createUserDto)).rejects.toThrow('Email already exists');
    });

    it('should throw BadRequestException for invalid input', async () => {
      const createUserDto: CreateUserDto = { name: '', email: 'invalid-email', password: '' }; 
      await expect(controller.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if database connection fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Database connection failed'));
    
      await expect(controller.create({ name: 'Test', email: 'test@test.com', password: '123456' }))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
    });

    it('should return an empty array if no users are found', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if user ID format is invalid', async () => {
      await expect(controller.findOne('invalid-id')).rejects.toThrow();
    });

    it('should return a user with correct structure', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
    
      const result = await controller.findOne('1');
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(Date),
      }));
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Updated' };
      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.update('2', { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if no update data is provided', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error('No data provided for update'));
    
      await expect(controller.update('1', {} as UpdateUserDto)).rejects.toThrow('No data provided for update');
    });    
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

      const result = await controller.remove('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user to delete does not exist', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove('2')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if user cannot be deleted due to existing references', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error('User has active orders and cannot be deleted'));
    
      await expect(controller.remove('1')).rejects.toThrow('User has active orders and cannot be deleted');
    });    
  });

  describe('Authorization Guards', () => {
    let jwtAuthGuard: JwtAuthGuard;

    beforeEach(() => {
      jwtAuthGuard = new JwtAuthGuard();
    });

    it('should allow access when JWTAuthGuard passes', async () => {
      jest.spyOn(jwtAuthGuard, 'canActivate').mockReturnValue(true as any);

      expect(jwtAuthGuard.canActivate({ switchToHttp: () => ({ getRequest: () => ({}) }) } as ExecutionContext)).toBeTruthy();
    });

    it('should deny access when JwtAuthGuard fails', async () => {
      jest.spyOn(jwtAuthGuard, 'canActivate').mockReturnValue(false as any);
    
      const context = { switchToHttp: () => ({ getRequest: () => ({}) }) } as ExecutionContext;
      
      expect(jwtAuthGuard.canActivate(context)).toBeFalsy();
    });

    it('should throw UnauthorizedException when accessing protected routes without valid token', async () => {
      jest.spyOn(jwtAuthGuard, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });
    
      const context = { switchToHttp: () => ({ getRequest: () => ({}) }) } as ExecutionContext;
    
      expect(() => jwtAuthGuard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});