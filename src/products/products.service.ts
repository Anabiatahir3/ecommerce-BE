import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entitites/product.entity';
import { CreateProductDto } from 'src/dtos/products/create-product.dto';

@Injectable()
export class ProductsService {
    constructor ( @InjectRepository(Product) private ProductRepository :Repository<Product>){}


    async createProduct(createProductDto:CreateProductDto):Promise<Product>{
        const product= await this.ProductRepository.create(createProductDto)
        return this.ProductRepository.save(product)
    }

    async getProducts(){
        return this.ProductRepository.find({})
    }
    async findProductByName(name:string){
        const product=await this.ProductRepository.findBy({name})
        if(!product.length){
            return new BadRequestException("No product")
        }
     return product
    }
    async getProductById(id:number){
        const product=await this.ProductRepository.findOneBy({id})
        if (!product){
         return new BadRequestException("No product")

        }
        return product
    }
}
