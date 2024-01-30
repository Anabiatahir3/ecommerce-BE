import { IsString ,IsNotEmpty, IsObject, IsEnum,IsEmail,Validate,IsOptional} from "class-validator";
import { Role } from "src/enum/roles.enum";
import { IsUnique } from "src/utils/validators/is-unique.decorator";
export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsString()
    @IsNotEmpty()
    password:string

    @IsEmail()
    @IsNotEmpty()
    @IsUnique({tableName:"users",column:"email"})
    email:string
    
    @IsOptional()
    role:Role

}