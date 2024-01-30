import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Role } from 'src/enum/roles.enum';
import { Exclude } from "class-transformer";
import { Cart } from 'src/cart/entities/cart.entity';

@Entity('users') // this is table name
export class User {
@PrimaryGeneratedColumn()
  id: number;
@Column()
  username: string;
@Column({unique:true})
email: string;
@Column()
@Exclude()
password:string
@Column({type:'enum',enum:Role, nullable:true})
  role:Role

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}