import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Importa função para simular repositório
import { Repository } from 'typeorm'; // Interface do TypeORM
import { User } from './entities/user.entity'; // Importa a entidade User
import { EnvService } from '../env/env.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Simulamos um repositório do TypeORM
  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([]), // Simula método find() retornando um array vazio
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)), // Simula save() retornando o mesmo usuário recebido
  };

  // Mock do EnvService
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
      controllers: [UsersController], // Declara o controlador que será testado
      providers: [
        UsersService, // Declara o serviço
        {
          provide: getRepositoryToken(User), // Substitui o repositório real pelo mock
          useValue: mockUserRepository, // Usa o mockUserRepository definido acima
        },
        {
          provide: EnvService, // Mockando o EnvService
          useValue: mockEnvService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController); // Obtém a instância do controlador testado
    service = module.get<UsersService>(UsersService); // Obtém a instância do serviço testado
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); // Testa se o controlador foi criado corretamente
  });
});
