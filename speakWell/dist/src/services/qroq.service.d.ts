import { ConfigService } from '@nestjs/config';
export declare class QROQService {
    private configService;
    private readonly apiKey;
    constructor(configService: ConfigService);
    chatCompletion(model: string, messages: any): Promise<string>;
}
