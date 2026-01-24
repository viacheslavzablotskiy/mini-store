import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable, throwError } from "rxjs";
import { Roles } from "./roles.decorators";



@Injectable()
export class RolesGuards implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride(Roles, [
            context.getHandler(),
            context.getClass()
        ])
        if (!roles) return true

        const {user} = context.switchToHttp().getRequest<Request>()
        
        if (!user || !roles.includes(user.role)) {
            throw new HttpException('you dont have enough permission', HttpStatus.FORBIDDEN)
        }
        return true
    }
}