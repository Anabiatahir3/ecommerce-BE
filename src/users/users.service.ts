import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { User } from './entities/user.entity';
import {Repository} from 'typeorm'
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class UsersService {
    constructor ( @InjectRepository(User) private UserRepository :Repository<User>){}


    async createUser(userDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.username = userDto.username;
        user.email = userDto.email;
        user.password = await bcrypt.hash(userDto.password, 10);
        
        // Set the role to the provided value or use the default (Role.User)
        user.role = userDto.role || Role.User;
        return await this.UserRepository.save(user);
      }

async findUser(email:string){
return this.UserRepository.findOneBy({email})
}

async findOne(id:number){
  return this.UserRepository.findOneBy({id})
}

}
