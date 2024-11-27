import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { JiraService } from '../services/jira.service';

@Controller('jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

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

  @Post('create-ticket')
  async createTicket(@Body() ticketDetails: any): Promise<any> {
    try {
      const userId = ticketDetails.userId ?? '123';
      const filePath = `./chat_data/feedback_${userId}.json`;
      const result = await this.jiraService.createTicket(ticketDetails);
      await this.appendToJsonFile(filePath, 'jira_ticket', result);
      return {
        message: 'Ticket created successfully',
        ticket: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create Jira ticket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// endpoint: http://localhost:3000/jira/create-ticket
// body:
// {
//     "projectKey": "CS",
//     "summary": "Bug in login functionality - Test 3",
//     "description": "Users are unable to log in due to a server error.",
//     "issueType": "Task"
//   }
