import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // instnace of the documentation
  const configurationSwagger = new DocumentBuilder()
  .setTitle('Mini-store example')
  .setDescription('The mini-store Api description')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Tap in your JWT token to be able use all functional of the mini-store'
  }, 'mini-store-auth')
  .addCookieAuth('refreshToken', {
    type: 'apiKey',
    in: 'cookie',
    description: 'Refresh your expired JWT token'
  })
  .addGlobalResponse(
    {
    status: 500,
    description: 'server error'
    },
    {
      status: 403,
      description: 'forbiden'
    }
  )
  .build()
  const swaggerInstance = SwaggerModule.createDocument(app, configurationSwagger)
  SwaggerModule.setup('mini-store', app,  swaggerInstance)

  // for refresh accesToken if he is expered
  app.use(cookieParser())

  // allow to use dome of the React/Vite
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT', 3000)
  await app.listen(port);
}
bootstrap();
