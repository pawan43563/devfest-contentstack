import { Response } from 'express';
import { AudioAnalysisService } from '../services/audio.analysis.service';
import { VideoAnalysisService } from '../services/video.analysis.service';
import { ChatAnalysisService } from 'src/services/chat.analysis.service';
export declare class FeedbackController {
    private readonly videoAnalysisService;
    private readonly audioAnalysisService;
    private readonly chatAnalysisService;
    constructor(videoAnalysisService: VideoAnalysisService, audioAnalysisService: AudioAnalysisService, chatAnalysisService: ChatAnalysisService);
    private appendToJsonFile;
    getVisualFeedBack(response: Response, body: any, userId: string): Promise<any>;
    getAudioFeedBack(response: Response, body: any, userId: string): Promise<any>;
    getChatResolution(response: Response, body: any, userId: string): Promise<any>;
}
