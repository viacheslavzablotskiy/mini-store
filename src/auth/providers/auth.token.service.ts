import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenTypeData } from "src/common/request.extension.";
import {StringValue} from 'ms'

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}


    async createNewAccessToken(data: TokenTypeData): Promise<string> {
        return await this.jwtService.signAsync(data)
    }

    async createNewRefreshToken(data: TokenTypeData): Promise<string> {
        return await this.jwtService.signAsync(data, {secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<StringValue>('JWT_EXPIRES_IN_REFRESH_TOKEN')
        })
    }

    async getDataFromToken(token: string): Promise<TokenTypeData> {
        return await this.jwtService.verifyAsync(token, {secret: this.configService.get<string>('JWT_REFRESH_SECRET')})
    }
}
