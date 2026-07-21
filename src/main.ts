import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  // Especificar Express como plataforma (CLAVE para Swagger)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validaciones globales (llaves cerradas correctamente)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS para acceso local
  app.enableCors({ origin: '*', credentials: false });

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

  console.log('Servidor corriendo en: http://localhost:' + puerto);
  console.log('Documentación Swagger: http://localhost:' + puerto + '/api-docs');
}

// Ejecutar la función sin errores
bootstrap().catch(err => console.error('Error al iniciar:', err));