import { IsString,IsNumber,IsOptional, IsNotEmpty } from "class-validator";

export class PurchaseDto{
    @IsNotEmpty()
    cvv:string
    @IsNotEmpty()
    expiryDate:string
    @IsNotEmpty()
    cardNumber:string


}