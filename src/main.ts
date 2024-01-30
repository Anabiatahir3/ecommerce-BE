import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {useContainer} from "class-validator"


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{rawBody:true, cors: true});
  await app.listen(3000);
  useContainer(app.select(AppModule),{fallbackOnErrors:true})
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));}
bootstrap();
