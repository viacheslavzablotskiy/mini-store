import { ArgumentsHost, Catch, HttpException, Injectable } from "@nestjs/common";
import { type Request, type Response } from "express";




@Catch(HttpException)
@Injectable()
export class ExecptionFilter implements ExecptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus()
        
        response.status(status).json({
            status: status,
            message: exception.getResponse(),
            timestamp: new Date().toISOString(),
            url: request.url
        })
    }
}