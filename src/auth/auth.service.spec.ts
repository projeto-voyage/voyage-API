import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed_password',
    };

    const mockUsersService = {
        findByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('jwt_token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signIn', () => {
        it('should return a JWT token when valid credentials are provided', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);

            const result = await authService.signIn(email, pass);

            expect(result).toEqual({ access_token: 'jwt_token' });
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(pass, mockUser.password);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
        });

        it('should throw an UnauthorizedException when user is not found', async () => {
            const email = 'nonexistent@test.com';
            const pass = 'password';
            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
        });

        it('should throw an UnauthorizedException when password is incorrect', async () => {
            const email = 'test@test.com';
            const pass = 'invalid_password';
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
        });

        it('should throw an UnauthorizedException when user is not found', async () => {
            const email = 'nonexistent@test.com';
            const pass = 'password';
            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
        });

        it('should throw an UnauthorizedException when password is incorrect', async () => {
            const email = 'test@test.com';
            const pass = 'invalid_password';
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
        });

        it('should throw an UnauthorizedException when password comparison fails due to bcrypt error', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(bcrypt as any, 'compare').mockRejectedValue(new Error('bcrypt error'));

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(pass, mockUser.password);
        });

        it('should throw an UnauthorizedException when JWT generation fails', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
            jest.spyOn(mockJwtService, 'signAsync').mockRejectedValue(new Error('JWT generation error'));

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(pass, mockUser.password);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
        });

        it('should throw an UnauthorizedException when an error occurs in usersService.findByEmail', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(mockUsersService, 'findByEmail').mockRejectedValue(new Error('Database error'));

            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
        });

        it('should throw an error if email is empty', async () => {
            const email = '';
            const pass = 'valid_password';
            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
          });
          
          it('should throw an error if password is empty', async () => {
            const email = 'test@test.com';
            const pass = '';
            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
          });

          it('should throw an error if the email format is invalid', async () => {
            const email = 'invalid-email';
            const pass = 'valid_password';
            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
          });

          it('should throw an UnauthorizedException with the correct message when JWT generation fails', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
            jest.spyOn(mockJwtService, 'signAsync').mockRejectedValue(new Error('Invalid credentials'));
          
            await expect(authService.signIn(email, pass)).rejects.toThrowError('Invalid credentials');
          });

          it('should generate JWT with the correct payload', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';

            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
            jest.spyOn(mockUsersService, 'findByEmail').mockResolvedValue(mockUser);

            const jwtSpy = jest.spyOn(mockJwtService, 'signAsync').mockResolvedValue('jwt_token');
          
            const result = await authService.signIn(email, pass);
          
            expect(jwtSpy).toHaveBeenCalledWith({
              sub: mockUser.id,
              email: mockUser.email,
            });
            expect(result.access_token).toBe('jwt_token');
          });

          it('should throw an UnauthorizedException if password is empty in the database', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            const mockUserWithEmptyPassword = { ...mockUser, password: '' };
            mockUsersService.findByEmail.mockResolvedValue(mockUserWithEmptyPassword);
          
            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
          });

          it('should throw an UnauthorizedException when bcrypt throws an unexpected error', async () => {
            const email = 'test@test.com';
            const pass = 'valid_password';
            jest.spyOn(bcrypt as any, 'compare').mockRejectedValue(new Error('Unexpected error'));
          
            await expect(authService.signIn(email, pass)).rejects.toThrowError(UnauthorizedException);
          });
    });
});
