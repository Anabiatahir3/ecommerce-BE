import { Controller,Post,Get,Body, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from 'src/dtos/products/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('products')
export class ProductsController {
    constructor(private productService:ProductsService){

    }

    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
    addProduct(@Body() createProductDto:CreateProductDto){
        return this.productService.createProduct(createProductDto)
    }

    
    @Get()
    getProducts(){
        return this.productService.getProducts()
    }

    @Get('/single')
    getOneProduct(@Query('name')name:string){
        return this.productService.findProductByName(name)
    }
}
