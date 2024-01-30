import { IsString,IsNumber,IsOptional, IsNotEmpty } from "class-validator";

export class CreateProductDto{

@IsString()
@IsNotEmpty()
name:string

@IsString()
@IsOptional()
description:string

@IsNumber()
@IsNotEmpty()
price:number

@IsString()
@IsNotEmpty()
category:string

@IsString()
imageUrl:string
}