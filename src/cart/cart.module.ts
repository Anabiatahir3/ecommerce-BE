import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Cart } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entitites/product.entity';
import { ProductsModule } from 'src/products/products.module';
import { Transaction } from './entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
@Module({
  imports:[TypeOrmModule.forFeature([
    Item,Cart,User,Product,Transaction
  ]),UsersModule,ProductsModule,
  HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      timeout: configService.get('HTTP_TIMEOUT'),
      maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
    }),
    inject: [ConfigService],
  })],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
