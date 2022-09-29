import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'path';
import { promises } from 'fs';
import { LoggerService } from './logger/logger.service';
import { LoggingInterceptor } from './domain/interceptors/logging.interceptors';
import * as basicAuth from 'express-basic-auth';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1/api');

  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  const pkg = JSON.parse(await promises.readFile(join('.', 'package.json'), 'utf8'));

  const config = new DocumentBuilder()
    .setTitle('Cowrie')
    .setVersion(pkg.version)
    .setDescription('Payments API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addServer('https://api-staging.dunia.africa')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // TODO: Fix Logger
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  await app.listen(process.env.PORT);
}
bootstrap();
