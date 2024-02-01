import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService, private jwtService:JwtService){
    }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findUser(email);
        const isPasswordMatch = await bcrypt.compare(
          password,
          user.password
        );
        if (user && isPasswordMatch) {
          return user;
        }
        return null;
      }
      async login(user: any) {
        const payload = {  sub: user.id, email:user.email ,role:user.role};
        const access_token = this.jwtService.sign(payload);
    const expiresIn = this.jwtService.decode(access_token).exp;
        return {
          access_token: access_token,
          expiresIn:expiresIn
        };
      }
}
