import { Body, Controller, Post, Res, UseFilters, UseGuards} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginSwaggerReturnTypeData, LoginSwaggerTypeData, RegistSwaggerReturnTypeData, RegistSwaggerTypeData } from "src/common/types/auth-types/auth.types.swagger";
import {type Request, type Response} from 'express'
import {ValidationTypePipe} from '../common/pipes/common.pipe'
import { LoginDto, RegisterDto } from "src/common/types/auth-types/auth.class.validator.type";
import { User } from "src/generated/prisma/client";
import { AuthService } from "./providers/auth.service";
import { ReturnLoginTypeData } from "src/common/types/auth-types/auth.types";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "src/common/guards/common.auth.guard";
import { Roles } from "src/common/guards/roles.decorators";
import { RolesGuards } from "src/common/guards/common.role.guard";
import { ExecptionFilter } from "src/common/filters/common.exception";


@ApiTags('auth-service')
@UseFilters(ExecptionFilter)
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configeService: ConfigService
    ) {}

    @ApiOperation({summary: 'new User', description: 'creation new User'})
    @ApiBody({type: RegistSwaggerTypeData})
    @ApiResponse({status: 201, description: 'user was successfully created', type: RegistSwaggerReturnTypeData})
    @Post('/register')
    async registerMethod(@Body(new ValidationTypePipe()) dto: RegisterDto): Promise<User> {
        return this.authService.register(dto)
    }


    @ApiOperation({summary: 'Log In', description: 'Go into your account'})
    @ApiBody({type: LoginSwaggerTypeData})
    @ApiResponse({status: 201, description: 'you successfully log in', type: LoginSwaggerReturnTypeData})
    @Post('/login')
    async loginMethod(@Body(new ValidationTypePipe()) dto: LoginDto, @Res({passthrough: true}) res: Response): Promise<ReturnLoginTypeData> {
        const {accessToken, refreshToken, user} = await this.authService.login(dto)

        res.cookie(this.configeService.get<string>('JWT_REFRESH_NAME', ''), refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            path: '/'
        })

        return {
            user: user,
            accessToken: accessToken
        }
    } 

    @ApiOperation({summary: 'Log out', description: 'Log out from your account'})
    @ApiResponse({status: 201, description: 'you successfully log out'})
    @Roles(['USER', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuards)
    @Post('/logout')
    async logoutMethod(@Res({passthrough: true}) res: Response): Promise<void> {
        res.clearCookie(this.configeService.get<string>('JWT_REFRESH_NAME', ''), {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            path: '/'
        })
    }
}