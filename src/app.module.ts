import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PrismaModule,
    AuthModule,
    ProductModule,
    OrderModule
  ]
})
export class AppModule {}
