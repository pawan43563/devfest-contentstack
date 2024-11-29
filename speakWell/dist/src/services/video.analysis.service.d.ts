import { ChatGPTService } from './gpt.service';
export declare class VideoAnalysisService {
    private chatGptService;
    constructor(chatGptService: ChatGPTService);
    private getVideoDurationInFrames;
    extractFrames(inputVideoPath: any, numFrames?: number, outputDir?: string): Promise<void>;
    private prepareFramesForGPT;
    getVisualFeedback(framesDir?: string): Promise<any>;
}
