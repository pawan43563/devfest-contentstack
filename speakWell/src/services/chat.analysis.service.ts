import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatGPTService } from './gpt.service';
import { ConfigService } from '@nestjs/config';
import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import {
    DEFAULT_KB_DIR,
    MODELS,
  } from 'frameworks/utils/resources/app.constants';
import { audioFeedbackPrompt } from 'frameworks/utils/prompts/audio.feedback';

@Injectable()
export class ChatAnalysisService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatGptService: ChatGPTService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async extractData(body: any) {
    // get the data from knowledge base 

    let KBResponse;
    const folderPath = path.join(DEFAULT_KB_DIR);
    const files = readdirSync(folderPath);

    // Check if body.label is present in any filename
    const matchingFile = files.find(file => file.includes(body.label));

    if (matchingFile) {
        const filePath = path.join(folderPath, matchingFile);
        KBResponse = readFileSync(filePath, 'utf-8');
    } else {
        KBResponse = await this.analyzeWithGPT35(KBResponse, body.summary);
    }

    // use the data as a context in chatgpt
    const analysisResponse = await this.analyzeWithGPT35(body, KBResponse);

    return analysisResponse;


  }

  private async analyzeWithGPT35(body: string, KBResponse: any): Promise<any> {
    try {
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Based on the context provided: ${KBResponse}, please analyze the following information: ${JSON.stringify(body)} and provide a detailed solution with step by step only when it is present inside the context else just return NOT FOUND.`,
            },
          ],
        },
      ];
      const response = await this.chatGptService.chatCompletion(
        MODELS.GPT_4_TURBO,
        messages,
      );
      return Promise.resolve(response);
    } catch (error) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }
      return Promise.reject(error);
    }
  }

}
