import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EnvService } from '../env/env.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock do repositório TypeORM
  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([]), // Simula método find() retornando um array vazio
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)), // Simula método save() salvando o mesmo usuário
  };

  const mockEnvService = {
    get: jest.fn().mockImplementation((key) => {
      const mockValues = {
        JWT_SECRET: 'test-secret', // Valor de exemplo
      };
      return mockValues[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User), // Simula o UserRepository
          useValue: mockUserRepository, // Usa o mock definido acima
        },
        {
            provide: EnvService, // Mockando o EnvService
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
});