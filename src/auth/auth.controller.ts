import { Get,Body, Controller, Post, UseGuards,Request, ValidationPipe, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService,private userService:UsersService){

    }
    @Post('/signup')
    async signup(@Body(ValidationPipe)createUserDto:CreateUserDto){
        return this.userService.createUser(createUserDto)
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Request()req:any){

return this.authService.login(req.user)//in this we are returned the whole of the user
    }

    @Get('/user')
    @Roles(Role.User)
    @UseGuards(JwtAuthGuard,RolesGuard)
    async getUser(@Request()req:any){
        return req.user
    }


}
