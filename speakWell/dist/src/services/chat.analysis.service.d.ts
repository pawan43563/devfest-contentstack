import { QROQService } from './qroq.service';
import { ChatGPTService } from './gpt.service';
import { ConfigService } from '@nestjs/config';
export declare class ChatAnalysisService {
    private configService;
    private chatGptService;
    private QROQService;
    private openai;
    constructor(configService: ConfigService, chatGptService: ChatGPTService, QROQService: QROQService);
    extractLabel(fileData: any): Promise<any>;
    extractData(body: any, fileData: any): Promise<any>;
    private analyzeWithGPT35;
    private analyzeWithGroq;
}
