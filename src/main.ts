import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration, { validateConfiguration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

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
    .addBearerAuth() // Enable BearerAuth (for JWT tokens)
    .addCookieAuth('jwt') // Enable CookieAuth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  validateConfiguration(configuration(), 'configuration');

  await app.listen(configuration().port);
}

bootstrap();
