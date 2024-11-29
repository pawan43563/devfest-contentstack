import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class JiraService {
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('JIRA_API_BASE_URL');
    this.email = this.configService.get<string>('JIRA_API_EMAIL');
    this.apiToken = this.configService.get<string>('JIRA_API_TOKEN');
  }

  async getTicketSummary(userId: string): Promise<any> {
    const filePath = `./chat_data/feedback_${userId}.json`;
    const fileContent = readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    const ticketDetails = jsonData?.audioFeedback;
    return ticketDetails;
  }

  async createTicket(ticketDetails: any): Promise<any> {
    console.info('Ticket Details', ticketDetails);
    ticketDetails = JSON.parse(ticketDetails);
    const url = `${this.baseUrl}/rest/api/2/issue`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      'base64',
    );

    const payload = {
      fields: {
        project: {
          key: ticketDetails?.label?.toLowerCase()?.includes('marketplace')
            ? 'MKT'
            : 'CS',
        },
        summary: ticketDetails.title,
        description: ticketDetails.summary,
        issuetype: {
          name: ticketDetails.issueType || 'Task',
        },
      },
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.info('Error creating Jira ticket:', error?.response?.data);
      throw new HttpException(
        {
          message: 'Failed to create Jira ticket',
          error: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTicketDetails(ticketId: string): Promise<any> {
    const url = `${this.baseUrl}/rest/api/2/issue/${ticketId}`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      'base64',
    );

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch ticket details',
          error: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addCommentToTicket(ticketId: string, comment: string): Promise<void> {
    const url = `${this.baseUrl}/rest/api/2/issue/${ticketId}`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      'base64',
    );

    try {
      const bodyData = `{
        "body": {
          "content": [
            {
              "content": [
                {
                  "text": ${comment},
                  "type": "text"
                }
              ],
              "type": "paragraph"
            }
          ],
          "type": "doc",
          "version": 1
        }
      }`;

      const response: any = await axios.post(url, bodyData, {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      return response.body;
    } catch (error) {
      console.log('error', error.response?.statusText);
      throw new HttpException(
        {
          message: 'Failed to add comment to ticket',
          error: error.response?.statusText || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
