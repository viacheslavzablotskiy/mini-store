import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './providers/auth.service';
import { TokenService } from './providers/auth.token.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Prisma } from '../generated/prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn(() => Promise.resolve('hashed')),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: jest.Mocked<TokenService>
  let prisma: jest.Mocked<PrismaService>

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, 
        {provide: PrismaService, useValue: {user :{create: jest.fn(), findUniqueOrThrow: jest.fn()}}},
        {provide: TokenService, useValue: {createNewAccessToken: jest.fn(), createNewRefreshToken: jest.fn(), getDataFromToken: jest.fn()}}
      ]
    }).compile()


    authService = app.get<AuthService>(AuthService)
    prisma = app.get(PrismaService)
    tokenService = app.get(TokenService)
  });

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should hash password', async () => {
      const result = await authService.getHashPassword('123')
      expect(result).toBe('hashed')
      expect(bcrypt.hash).toHaveBeenCalled()
      expect(bcrypt.genSalt).toHaveBeenCalled()
  })

  it('register user', async () => {
    jest.spyOn(authService, 'getHashPassword').mockResolvedValue('hashed')
    jest.spyOn(prisma.user, 'create').mockResolvedValue({id: 1, login: 'zlava', email: 'zlava.mag@gmail.com',
    password: 'hashed', role: 'USER', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})

    const result = await authService.register({email: 'zlava.mag@gmail.com', login: 'zlava', password: '111111111'})
    expect(result.password).toBe('hashed')
    expect(prisma.user.create).toHaveBeenCalled()
  })

  it('should throw error for dublicate', async() => {
    jest.spyOn(authService, 'getHashPassword').mockResolvedValue('hashed')
    jest.spyOn(prisma.user, 'create').mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {code: 'P2002', clientVersion: '1.0'}))

    await expect(authService.register({login: 'zlava', email: 'zlava.mag@gmail.com', password: '111111111'}))
    .rejects.toThrow(new HttpException('User with this email or login already existed', HttpStatus.CONFLICT))
  })

  it('successfully login', async() => {
    jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue({id: 1, login: 'zlava', email: 'zlava.mag@gmail.com',
    password: '111111111', role: 'USER', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
    jest.spyOn(authService, 'compareHashes').mockResolvedValue(true)
    jest.spyOn(tokenService, 'createNewAccessToken').mockResolvedValue('access')
    jest.spyOn(tokenService, 'createNewRefreshToken').mockResolvedValue('refresh')

    const result = await authService.login({email: 'zlava.mag@gmail.com', password: '11111111'})
    expect(result.accessToken).toBe('access')
    expect(result.refreshToken).toBe('refresh')
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled()
  })

  it('throw error because or unanthorized or invalid login', async () => {
    jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue({id: 1, login: 'zlava', email: 'zlava.mag@gmail.com',
    password: '111111111', role: 'USER', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
    jest.spyOn(authService, 'compareHashes').mockImplementation(() => Promise.resolve(false))

    await expect(authService.login({email: 'zlava.mag@gmail.com', password: '123456788'})).rejects.toThrow(
      new HttpException("Invalid email or password", HttpStatus.UNAUTHORIZED)
    )
  })
});
