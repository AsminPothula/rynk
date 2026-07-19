import { Config } from '@config';
import * as AllErrors from '@error';
import { INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { MainModule } from './main.module';
import { globalValidationPipe } from './pipes/validation.pipe';

function setupSwagger(app: INestApplication) {
  const swaggerBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Starter API')
    .setDescription('Open API documentation for NestJS Starter project')
    .setExternalDoc('Download JSON version', '/api-json')
    .setVersion('1.0');
  const swaggerConfig = swaggerBuilder.build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [...Object.values(AllErrors)],
  });
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(globalValidationPipe);

  //TODO: Update the limit to 1mb when the issue is fixed for uploading data for template-fit-rules
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  setupSwagger(app);

  await app.listen(Config.Server.Port);
}
bootstrap();
