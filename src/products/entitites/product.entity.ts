import {Column,Entity,PrimaryGeneratedColumn,OneToMany} from "typeorm"
import { Item } from "src/cart/entities/item.entity"


@Entity('products')
export class Product{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    price:number

    @Column()
    description:string

    @Column()
    imageUrl:string

    @Column()
    category:string

    @OneToMany(() => Item, (item) => item.product)
  items: Item[];

}