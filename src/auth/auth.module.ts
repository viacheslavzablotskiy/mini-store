import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import {StringValue} from 'ms'
import { AuthMiddlewareClass } from "./utils/auth.middware";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./utils/auth.guard";


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
    providers: [JwtStrategy],
    exports: []
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddlewareClass).exclude().forRoutes(AuthController)
    }
}