import { Body, Controller, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
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
    @Query('userId') userId: string,
  ): Promise<any> {
    // const userId = body.userId ?? '123';
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
    @Query('userId') userId: string,
  ): Promise<any> {
    // const userId = body.userId ?? '123';
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
    @Query('userId') userId: string,
  ): Promise<any> {
    // const userId = body.userId ?? '123';
    const filePath = `./chat_data/feedback_${userId}.json`;
    const fileData = JSON.parse(readFileSync(filePath, 'utf-8'));

    // check if issueLabel is present in the body
    // if not then extract it from the file and ask user to confirm
    let issueLabel = null;
    let parsedBody;

    if (typeof body === 'string') {
        try {
            parsedBody = JSON.parse(body);
        } catch (error) {
            console.error("Failed to parse body:", error);
            // Handle the error as needed, e.g., set parsedBody to null or throw an error
            parsedBody = null; // or throw new Error("Invalid JSON format");
        }
    } else {
        parsedBody = body; // If body is not a string, use it as is
    }
    if (!parsedBody?.issueLabel) {
      issueLabel = await this.chatAnalysisService.extractLabel(fileData);
      if (!issueLabel) {
        return response
          .status(200)
          .send(
            'Could not understand what this issue is from. Can you share the label?',
          );
      }
      return response.status(200).send({ issueLabel });
    } else {
      issueLabel = parsedBody.issueLabel;
      await this.appendToJsonFile(filePath, 'issueLabel', issueLabel);
      const chatFeedback = await this.chatAnalysisService.extractData(
        parsedBody,
        fileData,
      );
      await this.appendToJsonFile(filePath, 'chatFeedback', chatFeedback);
      return response.status(200).send(chatFeedback);
    }
  }
}
