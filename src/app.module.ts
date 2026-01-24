import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60_000,
        limit: 10
      },
      {
        name: 'product',
        ttl: 30_000,
        limit: 2
      },
      {
        name: 'order',
        ttl: 10_000,
        limit: 1
      }
    ]),
    PrismaModule,
    AuthModule,
    ProductModule,
    OrderModule
  ]
})
export class AppModule {}
