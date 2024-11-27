import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';


@Injectable()
export class QROQService {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('QROK_API_KEY');
  }

  async chatCompletion(model: string, messages: any): Promise<string> {
    try {
        const client = new Groq({
            apiKey: this.apiKey, // This is the default and can be omitted
        });
        const response: any = await client.chat.completions.create({
          model,
          messages
        });
        return Promise.resolve(response.choices[0]?.message?.content);
    } catch (error) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }
      return 'Something went wrong';
    }
  }
}
