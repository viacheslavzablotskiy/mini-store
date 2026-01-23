import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {AuthGuard, PassportStrategy} from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenTypeData } from "src/common/types/express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', '')
        })
    }

    validate(payload: TokenTypeData): TokenTypeData{
        return payload
    }
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException('Token is not valid')
        }
        return user
    }
}