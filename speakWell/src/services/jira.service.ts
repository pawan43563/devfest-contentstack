import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

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

  async createTicket(ticketDetails: any): Promise<any> {
    const url = `${this.baseUrl}/rest/api/2/issue`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      'base64',
    );

    const payload = {
      fields: {
        project: {
          key: ticketDetails.projectKey,
        },
        summary: ticketDetails.summary,
        description: ticketDetails.description,
        issuetype: {
          name: ticketDetails.issueType,
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
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
  
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
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
  
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
      console.log("response", response)
      return response.body;
    } catch (error) {
      console.log("error", error.response?.statusText);
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
