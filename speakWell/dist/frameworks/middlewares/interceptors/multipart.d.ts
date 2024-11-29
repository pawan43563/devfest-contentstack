import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class MultipartInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<any>;
    validateFiles(files: any): any;
    generateError(data: any): Error;
    getFieldnameWithoutBrackets(fieldname: string): string;
    isValidVideoMimeType(filename: string): boolean;
}
