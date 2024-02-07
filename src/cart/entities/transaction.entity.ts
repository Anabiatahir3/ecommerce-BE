import {Column, Entity, PrimaryGeneratedColumn,OneToOne,JoinColumn} from 'typeorm'
import { Cart } from './cart.entity'
 
@Entity('transaction')
export class Transaction{
    @PrimaryGeneratedColumn()
    id:number
 
    @Column()
    cardNumber:string
 
    @Column()
    expiryDate:string
 
    @Column()
    cvv:string

    @OneToOne(() => Cart)
    @JoinColumn()
    cart:Cart
 
}