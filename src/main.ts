import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/');

  // CORS: Allowed list
  app.enableCors({
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Reject request with data that is not in the DTO
      forbidNonWhitelisted: true, // Force rejection of non-whitelisted data
      disableErrorMessages: process.env.NODE_ENV == 'production' ? true : false, // Disable detailed error messages in production
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert Query params to numbers or other types if possible
      },
    }),
  );

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Testing API')
    .setDescription('The Testing API Endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
