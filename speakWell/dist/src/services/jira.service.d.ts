import { ConfigService } from '@nestjs/config';
export declare class JiraService {
    private readonly configService;
    private readonly baseUrl;
    private readonly email;
    private readonly apiToken;
    constructor(configService: ConfigService);
    getTicketSummary(userId: string): Promise<any>;
    createTicket(ticketDetails: any): Promise<any>;
    getTicketDetails(ticketId: string): Promise<any>;
    addCommentToTicket(ticketId: string, comment: string): Promise<void>;
}
