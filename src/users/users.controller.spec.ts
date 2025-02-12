import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EnvService } from '../env/env.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'hashed-password', createdAt: new Date() };

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

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    jest.spyOn(service, 'create').mockResolvedValue(mockUser);

    const result = await controller.create(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should return all users', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([mockUser]);

    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should return a single user by ID', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

    const result = await controller.findOne('1');
    expect(result).toEqual(mockUser);
  });

  it('should update a user by ID', async () => {
    const updateUserDto: UpdateUserDto = { name: 'John Updated' };
    const updatedUser = { ...mockUser, ...updateUserDto };
    jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

    const result = await controller.update('1', updateUserDto);
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user by ID', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

    const result = await controller.remove('1');
    expect(result).toEqual(mockUser);
  });
});
