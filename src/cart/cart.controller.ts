import { Get,Controller,Post,UseGuards,Body,Request,Delete, NotFoundException,Param} from '@nestjs/common';
import { Role } from 'src/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ItemDTO } from 'src/dtos/item/item.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CartService } from './cart.service';


@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
export class CartController {
constructor(private cartService:CartService){}

@Get('/')
async getUserCart(@Request()req){
  const userId=req.user.userId
  return this.cartService.getCart(userId)
}

    @Post('/')
    async addItemToCart(@Request()req,@Body() itemDto:ItemDTO){
        const userId=req.user.userId
        return this.cartService.addItemToCart(userId,itemDto)
    }
    @Delete('/')
    async removeItemFromCart(@Request()req, @Body() {productId}){
        const userId=req.user.userId
        const cart=await this.cartService.removeItemFromCart(userId,productId)
        return cart
    }
    

    @Delete('/:id')
  async deleteCart(@Param('id') userId: number) {
    const cart = await this.cartService.deleteCart(userId);
    return cart;
  }

}
