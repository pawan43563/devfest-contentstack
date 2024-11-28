import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { QROQService } from './qroq.service';
import { ChatGPTService } from './gpt.service';
import { ConfigService } from '@nestjs/config';
import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import {
  DEFAULT_KB_DIR,
  MODELS,
  QROQ_MODAL,
} from 'frameworks/utils/resources/app.constants';
import { extractSummary, toLowercaseAndRemoveSpaces } from 'frameworks/utils/functions';

@Injectable()
export class ChatAnalysisService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatGptService: ChatGPTService,
    private QROQService : QROQService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async extractLabel(fileData: any) {
    // read file from the file path
    console.info(fileData, 'fileData', typeof fileData);
    const labelMatch = fileData.audioFeedback.match(/- Label:\s*(.+)/);
    const issueLabel = labelMatch ? labelMatch[1].trim() : null;

    console.log(issueLabel, 'issueLabel');
    return issueLabel;
  }

  async extractData(body: any, fileData: any) {
    // get the data from knowledge base

    let KBResponse;
    const folderPath = path.join(DEFAULT_KB_DIR);
    const files = readdirSync(folderPath);

    // Check if body.label is present in any filename
    const matchingFile = files.find((file) =>
      file.includes(toLowercaseAndRemoveSpaces(body.issueLabel)),
    );
    if (matchingFile) {
      const filePath = path.join(folderPath, matchingFile);
      KBResponse = readFileSync(filePath, 'utf-8');
    } else {
      // ----- here KBResponse param is empty ??
      // add the source from documentation link
      KBResponse = await this.analyzeWithGPT35(KBResponse, body.summary);
    }

    const summary = extractSummary(fileData?.audioFeedback);
    // use the data as a context in chatgpt
    const analysisResponse = await this.analyzeWithGPT35(summary, KBResponse);

    return analysisResponse;
  }

  private async analyzeWithGPT35(body: string, KBResponse: any): Promise<any> {
    console.info(body, 'body');
    try {
      const messages = [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: `You are a Customer Service Engineer. This is your context: ${KBResponse}. Don't answer out of context.`,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze the following information: ${JSON.stringify(body)} and provide a detailed solution with step by step if relevant solution is present inside the context. Don't give general troubleshooting steps. Don't mention 'context' in the response. If you do give a solution mention 'ContentSpock' as the title.`,
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

  private async analyzeWithGroq(body: string, KBResponse: any): Promise<any> {
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
      const response = await this.QROQService.chatCompletion(
        QROQ_MODAL,
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
