import { ChatGPTService } from './gpt.service';
import { ConfigService } from '@nestjs/config';
export declare class AudioAnalysisService {
    private configService;
    private chatGptService;
    private openai;
    constructor(configService: ConfigService, chatGptService: ChatGPTService);
    extractAudioFromVideo(filePath: string): Promise<string>;
    private extractAudio;
    analyzeAudio(audioFilePath: string): Promise<any>;
    transcribeAudio(audioFilePath: string): Promise<string>;
    private analyzeWithGPT35;
}
