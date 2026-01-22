import { Injectable, NestMiddleware } from "@nestjs/common";
import { type Request, type Response, type NextFunction } from "express";


@Injectable()
export class AuthMiddlewareClass implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const headerToken: string | undefined = req.headers['authorization']
        if (!headerToken) return res.status(401).send('you dont have token')
        if (!headerToken.split(' ')[1]) return res.status(401).send('Your Token is not valid')
        next()
    }   
}