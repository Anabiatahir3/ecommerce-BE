import {Column, PrimaryGeneratedColumn,ManyToOne,OneToMany,Entity} from 'typeorm'
import { User } from 'src/users/entities/user.entity';
import { Item } from './item.entity';
@Entity('cart')
export class Cart{
    @PrimaryGeneratedColumn()
    id:number
 
    @Column()
    totalPrice:number
 
  @OneToMany(() => Item, (item) => item.cart)
  items: Item[];
 
    @ManyToOne(() => User, (user) => user.carts)
    user: User;
 
    @Column()
    purchased:boolean=false
 
}
