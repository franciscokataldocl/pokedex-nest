import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted:true,
  }));

  await app.listen(process.env.APP_PORT);
}
bootstrap();