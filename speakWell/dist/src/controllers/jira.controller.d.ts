import { JiraService } from '../services/jira.service';
import { ChatGPTService } from 'src/services/gpt.service';
export declare class JiraController {
    private readonly jiraService;
    private chatGptService;
    constructor(jiraService: JiraService, chatGptService: ChatGPTService);
    private appendToJsonFile;
    getTicketSummary(userId: string): Promise<any>;
    createTicket(ticketDetails: any, userId: string): Promise<any>;
    postUpdates(ticketId: string, comment: any): Promise<any>;
    statusWebhook(issueId: string, issueKey: string, projectKey: string): Promise<any>;
}
