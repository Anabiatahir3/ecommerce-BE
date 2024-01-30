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

@Module({
  imports:[TypeOrmModule.forFeature([
    Item,Cart,User,Product
  ]),UsersModule,ProductsModule],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
