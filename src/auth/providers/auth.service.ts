import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { LoginTypeData, RegisterTypData, ReturnLoginType } from "src/common/types/auth-types/auth.types";
import { Prisma, User } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypto from 'bcrypt'
import { TokenService } from "./auth.token.service";
import { TokenTypeData } from "src/common/types/express";
import { ReturnLoginTypeData } from "src/common/types/auth-types/auth.types";

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService
    ) {}
    
    async getHashPassword(password: string): Promise<string> {
        const salt = await bcrypto.genSalt(10)
        return bcrypto.hash(password, salt)
    }

    async compareHashes(dtoPassword: string, userPassword: string): Promise<boolean> {
        return bcrypto.compare(dtoPassword, userPassword)
    }

    async register(data: RegisterTypData): Promise<User> {
        try {
            return await this.prisma.user.create({data})
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new HttpException('User with this email or login already existed', HttpStatus.CONFLICT)   
            }
            throw error
        }
    }

    async login({email, password}: LoginTypeData): Promise<ReturnLoginType> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({where: {email: email}})
            const isValid = await this.compareHashes(password, user.password)
            if (!isValid) throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)

            
            const payload: TokenTypeData = {id: user.id, email: user.email, login: user.login, role: user.role}
            const [accessToken, refreshToken] = await Promise.all(
            [this.tokenService.createNewAccessToken(payload), this.tokenService.createNewRefreshToken(payload)])

            return {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND)
                }
            throw error
            }
        }

}

