import {Column, Entity,ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Product } from 'src/products/entitites/product.entity';
import { Cart } from './cart.entity';

@Entity("items")
export class Item{

    @PrimaryGeneratedColumn()
    id:number

     @Column({nullable:true})
     name:string

    @Column()
    price:number

    @Column()
    quantity:number

    @Column()
    subTotalPrice:number

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.items)
    product: Product;
}