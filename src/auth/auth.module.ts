import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import {StringValue} from 'ms'
import { AuthController } from "./auth.controller";
import { AuthService } from "./providers/auth.service";
import { JwtStrategy } from "src/common/guards/common.auth.guard";

@Module({
    imports: [
        JwtModule.registerAsync({
        global: true,
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET', ''),
            signOptions: {expiresIn: config.get<StringValue>('JWT_EXPIRES_IN', '8m')}
        })
    })
],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: []
})
export class AuthModule {}