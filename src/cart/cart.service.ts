import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { ItemDTO } from 'src/dtos/item/item.dto';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException,NotFoundException } from '@nestjs/common/exceptions';
import { Item } from './entities/item.entity';
import { Product } from 'src/products/entitites/product.entity';
import { PurchaseDto } from 'src/dtos/cart/purchaseCart.dto';
import { Transaction } from './entities/transaction.entity';
import { HttpService } from '@nestjs/axios/dist';
import { lastValueFrom, map ,tap} from 'rxjs';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private CartRepository :Repository<Cart>,
        @InjectRepository(User) private UserRepository:Repository<User>,
        @InjectRepository(Item) private ItemRepository:Repository<Item>,
        @InjectRepository(Product) private ProductRepository:Repository<Product>,
        @InjectRepository(Transaction) private TransactionRepository:Repository<Transaction>,
        private httpService:HttpService)
        {
    }
  
  async getCart(userId:number):Promise<Cart>{
    const user=await this.UserRepository.findOneBy({id:userId})
    const cart =await this.CartRepository.findOne({where:{user,purchased:false},relations:['items',"items.product"]})
    return cart
  }

async deleteCart(userId: number): Promise<void> {
  const user = await this.UserRepository.findOneBy({ id: userId });
  const cart = await this.CartRepository.findOne({ where: { user,purchased:false }, relations: ['items'] });

  if (!cart) {
    throw new NotFoundException(`Cart not found for user with ID ${userId}`);
  }

  await Promise.all(cart.items.map(item => this.ItemRepository.delete(item.id)));

  await this.CartRepository.delete(cart.id);
}


    private recalculateCart(cart:Cart){
        cart.totalPrice=0
        cart.items.forEach((item)=>cart.totalPrice+=item.quantity*item.price)
    }

    
    async addItemToCart(userId: number, itemDTO: ItemDTO): Promise<Cart> {
        const { productId, quantity } = itemDTO;
        const product = await this.ProductRepository.findOneBy({ id: productId });
        const user = await this.UserRepository.findOneBy({ id: userId });
        const subTotalPrice = quantity * product.price;
        let cart: Cart = await this.CartRepository.findOne({where:{user,purchased:false},relations:['items','items.product']})
        if (cart) {
          const item = cart.items.find((item) => item.product.id === productId);
          if (item) {
            item.quantity += quantity;
            item.subTotalPrice = item.quantity *product.price;
            this.ItemRepository.save(item)
            this.CartRepository.save(cart)
          } else {
            const newItem = this.ItemRepository.create({
              product,
              quantity,
              price:product.price,
              subTotalPrice,
              cart,
            });
            this.ItemRepository.save(newItem);
            cart.items.push(newItem);
          }
          this.recalculateCart(cart);
          return this.CartRepository.save(cart);
        } else {
          const newItem=this.ItemRepository.create({
            product,
            quantity,
            price:product.price,
            subTotalPrice:subTotalPrice,
          })
          const newCart = this.CartRepository.create({
            user,
            items:[newItem],
            totalPrice: subTotalPrice,
            purchased:false
          });
          this.CartRepository.save(newCart);
          newItem.cart=newCart
          this.ItemRepository.save(newItem)
          return newCart
        }
      }
    
      
    async removeItemFromCart(userId: number, productId: number) {
      const user = await this.UserRepository.findOneBy({ id: userId });
      let cart: Cart = await this.CartRepository.findOne({where:{user,purchased:false},relations:['items','items.product']})
      if (!cart) {
          throw new NotFoundException(`Cart not found for user with ID ${userId}`);
        }
        const itemToRemove = cart.items.find((item) => item.product.id == productId);
        if (!itemToRemove) {
          throw new NotFoundException(`Item with product ID ${productId} not found in the cart`);
        }else{
        await this.ItemRepository.delete(itemToRemove.id);
        cart.items = cart.items.filter((item:Item) => item.product.id !== productId);
        this.recalculateCart(cart)
        return this.CartRepository.save(cart);
    }
    }
   

    async removeSingleItemFromCart(userId: number, productId: number): Promise<Cart> {
      const user = await this.UserRepository.findOneBy({ id: userId });
      let cart: Cart = await this.CartRepository.findOne({ where: { user,purchased:false }, relations: ['items', 'items.product'] });
    
      if (cart) {
        const itemToRemove = cart.items.find((item) => item.product.id === productId);
    
        if (itemToRemove) {
          if (itemToRemove.quantity > 1) {
            // If quantity is greater than 1, reducing quantity
            itemToRemove.quantity--;
            itemToRemove.subTotalPrice = itemToRemove.quantity * itemToRemove.product.price;
            this.ItemRepository.save(itemToRemove);
          } else {
            // If quantity 1, remove the item from cart
            const itemIndex = cart.items.indexOf(itemToRemove);
            cart.items.splice(itemIndex, 1);
            this.ItemRepository.remove(itemToRemove);
          }
    
          this.recalculateCart(cart);
          return this.CartRepository.save(cart);
        } else {
          throw new NotFoundException(`Item with product ID ${productId} not found in the cart`);
        }
      } else {
        throw new NotFoundException(`Cart not found for user with ID ${userId}`);
      }
    }

    async purchaseCart(userId:number,purchaseDto:PurchaseDto){
      const {cvv,expiryDate,cardNumber}=purchaseDto
      const user = await this.UserRepository.findOneBy({ id: userId });
      let cart: Cart = await this.CartRepository.findOne({ where: { user,purchased:false }, relations: ['items', 'items.product'] });
    const newTransaction =this.TransactionRepository.create({
      cart,
      cvv,
      cardNumber,
      expiryDate
    })
    this.TransactionRepository.save(newTransaction)
    try {
      await lastValueFrom(this.httpService.post(
        'https://api.dev.preczn.com/v1/transactions',
        {
          "merchantId": "mid_test_2csy0hfaqg8d3s4y34b5v2dzhg",
          "type": "sale",
          "payment": {
            "number": cardNumber,
            "cvv": cvv,
            "expiration": expiryDate
          },
          "amount": cart.totalPrice,
          "fee": 0
        },
        {
          headers: {
        'x-api-key':"a1a"
          }
        }
      ).pipe(
map((res)=>{
  console.log("res",res)
})
      )).then(()=>{
        cart.purchased = true;
    return this.CartRepository.save(cart);
      })
    } catch (error) {
      console.log(error);
      throw error; 
    }
    
  }}
