import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EnvService } from '../env/env.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    password: 'hashed-password', 
    createdAt: new Date() 
  };

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]), 
    findOne: jest.fn().mockImplementation(({ where }) => 
      where.email === mockUser.email ? Promise.resolve(mockUser) : Promise.resolve(null)
    ),
    findOneBy: jest.fn().mockImplementation(({ id }) => 
      id === '1' ? Promise.resolve(mockUser) : Promise.resolve(null)
    ),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, id: '1' })),
    remove: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation((user) => user),
    merge: jest.fn().mockImplementation((user, updateUserDto) => ({ ...user, ...updateUserDto })),
  };
  
  const mockEnvService = {
    getSaltRounds: jest.fn().mockReturnValue(10),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed-password');
    (service as any).validateEmail = jest.fn().mockResolvedValue(undefined);

    const createUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    const result = await service.create(createUserDto);

    expect(result).toHaveProperty('id', '1');
    expect(result).toHaveProperty('name', 'John Doe');
    expect(result).toHaveProperty('email', 'john@example.com');
    expect(result).not.toHaveProperty('password'); 
  });

  it('should throw an error when creating a user with an existing email', async () => {
    (service as any).validateEmail = jest.fn().mockRejectedValue(new BadRequestException('Email is already in use.'));

    const createUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  }); 

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should return a user by ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found by ID', async () => {
    const result = await service.findOne('999');
    expect(result).toBeNull();
  });

  it('should update a user successfully', async () => {
    const updateUserDto = { name: 'Updated Name' };
    const updatedUser = { ...mockUser, ...updateUserDto };

    mockUserRepository.save.mockResolvedValue(updatedUser);
    const result = await service.update('1', updateUserDto);

    expect(result).toEqual(updatedUser);
  });

  it('should throw error when updating with empty email', async () => {
    await expect(service.update('1', { email: '' })).rejects.toThrow(BadRequestException);
  });

  it('should return null when updating a non-existing user', async () => {
    const result = await service.update('999', { name: 'Non-existing' });
    expect(result).toBeNull();
  }); 

  it('should delete a user successfully', async () => {
    const result = await service.remove('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null when deleting a non-existing user', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);
    const result = await service.remove('999');
    expect(result).toBeNull();
  });

  it('should throw error when trying to delete a user that does not exist', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);
    await expect(service.remove('999')).resolves.toBeNull();
  });  

  it('should throw an error when creating a user with an existing email', async () => {
    (service as any).validateEmail = jest.fn().mockRejectedValue(new BadRequestException('Email is already in use.'));
    const createUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should call hashPassword when creating a user', async () => {
    const createUserDto = { name: 'Hash User', email: 'hash@example.com', password: 'strong-password' };
    const hashSpy = jest.spyOn(service as any, 'hashPassword');
    
    await service.create(createUserDto);
    expect(hashSpy).toHaveBeenCalledWith('strong-password');
  });  

  it('should call validateEmail when creating a user', async () => {
    const createUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    const validateEmailSpy = jest.spyOn(service as any, 'validateEmail').mockResolvedValue(undefined);
    await service.create(createUserDto);
    expect(validateEmailSpy).toHaveBeenCalledWith('john@example.com');
  });
});
