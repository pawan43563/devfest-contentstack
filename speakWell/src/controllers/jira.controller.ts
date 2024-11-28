import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { JiraService } from '../services/jira.service';
import { ChatGPTService } from 'src/services/gpt.service';
import { DEFAULT_KB_DIR, JIRAFILEMAPPER, MODELS } from 'frameworks/utils/resources/app.constants';
import * as path from 'path';
import { writeFileSync, readdirSync, readFileSync } from 'fs';

@Controller('jira')
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private chatGptService: ChatGPTService,
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



  @Get('get-ticket-summary')
  async getTicketSummary(@Query('userId') userId: string): Promise<any> {
    try {
      const ticketDetails = await this.jiraService.getTicketSummary(userId);
      return {
        ticket: ticketDetails,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to get details for the Jira ticket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-ticket')
  async createTicket(
    @Body() ticketDetails: any,
    @Query('userId') userId: string,
  ): Promise<any> {
    try {
      //   const userId = ticketDetails.userId ?? '123';
      const filePath = `./chat_data/feedback_${userId}.json`;
      const result = await this.jiraService.createTicket(ticketDetails);
      await this.appendToJsonFile(filePath, 'jira_ticket', result);
      return {
        message: 'Ticket created successfully',
        ticket: result,
      };
    } catch (error) {
      console.info("Error", error);
      throw new HttpException(
        {
          message: 'Failed to create Jira ticket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // ticket details and make kb and append it in label kb

  

  // endpoint to ask for updates
  // input - ticket id and comments 
  // output - status 200 body: added
  // project key - CS, CLOUD, MKT
  @Post('comments')
  async postUpdates(
    @Query('ticketId') ticketId: string,
    @Body() comment: any,
  ):  Promise<any> {
    try {
      console.info("comment", comment);
      const response: any = await this.jiraService.addCommentToTicket(ticketId, comment);
      console.log("Response", response);
      return {
        message: "Added successfully"
      }
    } catch(error) {
      throw new HttpException(
        {
          message: 'Failed to fetch ticket details',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // call from jira workflow and add it in kb
  @Post('status-webhook')
  async statusWebhook(
    @Query('issueId') issueId: string,
    @Query('issueKey') issueKey: string,
    @Query('projectKey') projectKey: string,
  ): Promise<any> {
    if (!issueId || !issueKey) {
      throw new HttpException(
        { message: 'ticketId and key are required query parameters' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const ticketDetails = await this.jiraService.getTicketDetails(issueKey);
      const ticketDesciption =  ticketDetails?.fields?.issuetype?.description;
      const ticketComments =  ticketDetails?.fields?.comment?.comments?.join("|"); 

      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is the description: ${ticketDesciption} and comment: ${ticketComments}. Generate only 1 Q & A based on it.`,
            },
          ],
        },
      ];

      const response = await this.chatGptService.chatCompletion(
        MODELS.GPT_4_TURBO,
        messages,
      );

      console.info("REsponse", response);

      let filePath;
      // Define the path for the KB file
      const folderPath = path.join(DEFAULT_KB_DIR);
      const files = readdirSync(folderPath);

      // Check if body.label is present in any filename
      const matchingFile = files.find((file) => file.includes(JIRAFILEMAPPER[projectKey]));
      if (matchingFile) {
        filePath = path.join(folderPath, matchingFile);
      } else {
        // push it to generic one    
      }

      // Write the Q&A summary to the KB file
      writeFileSync(filePath, response, { flag: 'a' }); // Append to the file

      console.info("Q&A summary saved to KB file:", filePath);

      return Promise.resolve("Added Successfully");

    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch ticket details',
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
