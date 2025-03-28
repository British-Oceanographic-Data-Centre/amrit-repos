import { Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import {Request, Response} from 'express';


type ResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter{

    private readonly logger = new Logger(AllExceptionsFilter.name, { timestamp: true });

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseObj: ResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        }

        if (exception instanceof HttpException){
            responseObj.statusCode = exception.getStatus()
            responseObj.response = exception.getResponse()
        } else {
            responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            responseObj.response = 'Internal Server Error'
        }

        response 
            .status(responseObj.statusCode) 
            .json(responseObj);

        this.logger.error(responseObj.response);

        super.catch(exception, host);

    }
}