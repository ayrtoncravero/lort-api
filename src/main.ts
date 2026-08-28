import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppConfig } from './config/configuration';
import { buildSwaggerUiCdnHtml } from './common/swagger/swagger-ui-cdn-html';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: appConfig?.corsOrigin,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('LORT API')
    .setDescription('The Lord of the Rings API')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // swaggerUiEnabled:false skips SwaggerModule's own HTML/static-asset routes
  // (those serve swagger-ui-dist off disk via express.static, which 404s on
  // Vercel because serverless build tracing only bundles statically-imported
  // files). /api/docs-json and /api/docs-yaml are still registered below,
  // and we serve our own CDN-based Swagger UI page at /api/docs instead.
  SwaggerModule.setup('api/docs', app, document, { swaggerUiEnabled: false });
  app.getHttpAdapter().get('/api/docs', (_req: Request, res: Response) => {
    res.type('text/html');
    res.send(buildSwaggerUiCdnHtml('/api/docs-json', 'LORT API'));
  });

  await app.listen(appConfig?.port ?? 3000);
}

bootstrap();
