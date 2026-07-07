import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.setGlobalPrefix('api');

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin: corsOrigin.split(',').map((o) => o.trim()), credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Africa Game — Plateforme de Régulation')
    .setDescription('Concentrateur de paiements, monitoring des paris, audit et reporting multi-juridiction')
    .setVersion('4.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Africa Game Regulation API on port ${port}`);
}
bootstrap();
