import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { AudioAnalysisService } from '../services/audio.analysis.service';
import { VideoAnalysisService } from '../services/video.analysis.service';
import { MultipartInterceptor } from 'frameworks/middlewares/interceptors/multipart';
import { ChatAnalysisService } from 'src/services/chat.analysis.service';

@Controller('/feedback')
export class FeedbackController {
  constructor(
    private readonly videoAnalysisService: VideoAnalysisService,
    private readonly audioAnalysisService: AudioAnalysisService,
    private readonly chatAnalysisService: ChatAnalysisService,
  ) {}

  private async appendToJsonFile(
    filePath: string,
    key: string,
    data: any,
  ): Promise<void> {
    // Ensure the directory exists
    await fs.mkdir('./chat_data', { recursive: true });
    // Initialize file content if it doesn't exist
    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, JSON.stringify({}, null, 2), 'utf8');
    }
    // Read existing data
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    // Add or update the key-value pair
    jsonData[key] = data;
    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
  }

  @Post(['/visual', '/video'])
  @UseInterceptors(MultipartInterceptor)
  async getVisualFeedBack(
    @Res() response: Response,
    @Body() body: any,
  ): Promise<any> {
    const userId = body.userId ?? '123';
    const filePath = `./chat_data/feedback_${userId}.json`;

    await this.videoAnalysisService.extractFrames(body.path);

    const videoFeedback = await this.videoAnalysisService.getVisualFeedback();

    await this.appendToJsonFile(filePath, 'videoFeedback', videoFeedback);

    return response.status(200).send(videoFeedback);
  }

  @Post('/audio')
  @UseInterceptors(MultipartInterceptor)
  async getAudioFeedBack(
    @Res() response: Response,
    @Body() body: any,
  ): Promise<any> {
    const userId = body.userId ?? '123';
    const filePath = `./chat_data/feedback_${userId}.json`;

    const audioPath = await this.audioAnalysisService.extractAudioFromVideo(
      body.path,
    );
    const audioFeedback =
      await this.audioAnalysisService.analyzeAudio(audioPath);

    await this.appendToJsonFile(filePath, 'audioFeedback', audioFeedback);

    return response.status(200).send(audioFeedback);
  }

  // THIS IS FOR CHAT COMPLETION WHICH WILL CHECK KNOWLEDGE BASE AND RETURN THE RESOLUTION
  @Post('/chat')
  async getChatResolution(
    @Res() response: Response,
    @Body() body: any,
  ): Promise<any> {
    const userId = body.userId ?? '123';
    const filePath = `./chat_data/feedback_${userId}.json`;
    const chatFeedback = await this.chatAnalysisService.extractData(body);
    await this.appendToJsonFile(filePath, 'chatFeedback', chatFeedback);
    return response.status(200).send(chatFeedback);
  }
}
