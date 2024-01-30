import { IsString,IsNumber,IsOptional, IsNotEmpty } from "class-validator";


export class ItemDTO {

    @IsNumber()
    @IsNotEmpty()
    productId: number;
    @IsOptional()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
  }