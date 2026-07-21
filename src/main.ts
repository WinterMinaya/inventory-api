import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Especificar Express como plataforma
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Seguridad: Helmet protege contra XSS, clickjacking, etc.
  app.use(helmet());

  // Compresión gzip/brotli para respuestas HTTP
  app.use(compression());

  // CORS restrictivo - solo orígenes permitidos
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4200',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 3600,
  });

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gestión de Inventarios y Mantenimientos')
    .setDescription('Examen Final - API RESTful Segura y Escalable')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configuración completa de la ruta de Swagger
  SwaggerModule.setup('api-docs', app, document, {
    useGlobalPrefix: false,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Iniciar servidor
  const puerto = process.env.PORT || 3000;
  await app.listen(puerto, '0.0.0.0');

  logger.log(`Servidor corriendo en: http://localhost:${puerto}`);
  logger.log(`Documentación Swagger: http://localhost:${puerto}/api-docs`);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
