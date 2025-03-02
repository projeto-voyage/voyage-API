import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpStatus } from '@nestjs/common';

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
                        signIn: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('signIn', () => {
        it('deve retornar um token ao fazer login com sucesso', async () => {
            const dto: CreateAuthDto = { email: 'test@example.com', password: '123456' };
            const token = { access_token: 'mocked_token' };
            jest.spyOn(authService, 'signIn').mockResolvedValue(token);

            const result = await authController.singIn(dto);
            expect(result).toBe(token);
            expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
        });

        it('deve lançar erro ao tentar logar com credenciais inválidas', async () => {
            const dto: CreateAuthDto = { email: 'test@example.com', password: 'wrong' };
            jest.spyOn(authService, 'signIn').mockRejectedValue(new Error('Credenciais inválidas'));

            await expect(authController.singIn(dto)).rejects.toThrow('Credenciais inválidas');
            expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
        });

        it('deve lançar erro ao tentar logar sem email', () => {
            const dto: CreateAuthDto = { email: '', password: '123456' };
            expect(() => authController.singIn(dto)).toThrow('Email é obrigatório');
        });

        it('deve lançar erro ao tentar logar sem senha', () => {
            const dto: CreateAuthDto = { email: 'test@example.com', password: '' };
            expect(() => authController.singIn(dto)).toThrow('Senha é obrigatória');
        });

        it('deve lançar erro se o serviço de autenticação falhar', async () => {
            const dto: CreateAuthDto = { email: 'test@example.com', password: '123456' };
            jest.spyOn(authService, 'signIn').mockRejectedValue(new Error('Erro interno'));

            await expect(authController.singIn(dto)).rejects.toThrow('Erro interno');
        });
    });

    describe('googleAuth', () => {
        it('deve imprimir a mensagem de redirecionamento', () => {
            console.log = jest.fn();
            authController.googleAuth();
            expect(console.log).toHaveBeenCalledWith('Redirecting to Google...');
        });
    });

    describe('googleAuthRedirect', () => {
        it('deve retornar mensagem e usuário ao autenticar com sucesso', () => {
            const mockReq = { user: { id: '123', email: 'test@example.com' } };

            const result = authController.googleAuthRedirect(mockReq);
            expect(result).toEqual({
                message: 'Login bem-sucedido!',
                user: mockReq.user,
            });
        });

        it('deve lançar erro caso o usuário não seja retornado pelo Google', () => {
            const mockReq = { user: null };

            expect(() => authController.googleAuthRedirect(mockReq)).toThrow('Usuário não autenticado');
        });

        it('deve lançar erro caso o usuário retornado do Google seja inválido', () => {
            const mockReq = { user: {} };
            expect(() => authController.googleAuthRedirect(mockReq)).toThrow('Usuário inválido');
        });

        it('deve retornar corretamente os dados do usuário autenticado pelo Google', () => {
            const mockReq = { user: { id: '123', email: 'test@example.com', name: 'Test User' } };

            const result = authController.googleAuthRedirect(mockReq);
            expect(result).toEqual({
                message: 'Login bem-sucedido!',
                user: mockReq.user,
            });
        });

    });
});
