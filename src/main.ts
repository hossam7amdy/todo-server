import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import configuration, { validateConfiguration } from './config/configuration';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API documentation for a todo app')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local server')
    .addServer(
      'http://ec2-16-171-24-86.eu-north-1.compute.amazonaws.com:8080',
      'Development server',
    )
    .addBearerAuth() // Enable BearerAuth (for JWT tokens)
    .addCookieAuth('jwt') // Enable CookieAuth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  validateConfiguration(configuration(), 'configuration');

  await app.listen(configuration().port);
}

bootstrap();
