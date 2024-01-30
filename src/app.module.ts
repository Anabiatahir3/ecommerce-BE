import { Module,MiddlewareConsumer,NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import {ConfigService} from "@nestjs/config/dist"
import { AuthModule } from './auth/auth.module';
import { IsUniqueConstraint } from './utils/validators/is-unique.constraint';
// import { CorsMiddleware } from 'cors';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entitites/product.entity';
import { CartModule } from './cart/cart.module';
import { Item } from './cart/entities/item.entity';
import { Cart } from './cart/entities/cart.entity';



@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('host'),
        port: +configService.get('port'),
        username: configService.get('db_username'),
        password: configService.get('password'),
        database: configService.get('database'),
        entities: [User,Product,Cart,Item],
        synchronize: true,
      }),
      inject: [ConfigService]}),
    AuthModule,
    ProductsModule,
    CartModule],
   
  controllers: [AppController],
  providers: [AppService,IsUniqueConstraint],
})
export class AppModule{}
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // Enable CORS for all routes
//     consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
