import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],  // Habilitar logs detallados
  });
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 4000;

  // Swagger
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Sistema Administrativo')
    .setDescription(
      'El presente documento muestra los endpoints correspondientes al backend del Sistema Administrativo',
    )
    .setVersion('1.0')
    .addBearerAuth()  // Agregar Bearer Authentication para JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app
    .listen(port)
    .then(() => logger.log(`App running on port ${port}`))
    .catch((err) => logger.error(`No se inicializó la app: ${err}`));
}
bootstrap();
