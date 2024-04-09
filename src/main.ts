import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(process.env.DB_URI);
  const app = await NestFactory.create(AppModule.register());

  app.useGlobalPipes(new ValidationPipe());

  // Start Swagger
  const config = new DocumentBuilder()
    .setTitle('Book Store example')
    .setDescription('The book store API description')
    .setVersion('1.0')
    .addTag('bookstore')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
  // End Swagger

  await app.listen(3000);
}

bootstrap();
