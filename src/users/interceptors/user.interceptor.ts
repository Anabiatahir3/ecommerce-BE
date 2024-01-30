import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";
import { User } from "../entities/user.entity";

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    //console.log(context.getClass().name);
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => plainToInstance(User, item));
        } else {
          // If the data is not an array, transform the single object
          return plainToInstance(User, data);
        }
      })
    );
  }
}
