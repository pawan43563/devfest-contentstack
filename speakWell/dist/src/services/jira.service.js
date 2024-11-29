"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
let JiraService = class JiraService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = this.configService.get('JIRA_API_BASE_URL');
        this.email = this.configService.get('JIRA_API_EMAIL');
        this.apiToken = this.configService.get('JIRA_API_TOKEN');
    }
    async getTicketSummary(userId) {
        const filePath = `./chat_data/feedback_${userId}.json`;
        const fileContent = (0, fs_1.readFileSync)(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const ticketDetails = jsonData?.audioFeedback;
        return ticketDetails;
    }
    async createTicket(ticketDetails) {
        console.info('Ticket Details', ticketDetails);
        ticketDetails = JSON.parse(ticketDetails);
        const url = `${this.baseUrl}/rest/api/2/issue`;
        const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
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
            const response = await axios_1.default.post(url, payload, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.info('Error creating Jira ticket:', error?.response?.data);
            throw new common_1.HttpException({
                message: 'Failed to create Jira ticket',
                error: error.response?.data || error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTicketDetails(ticketId) {
        const url = `${this.baseUrl}/rest/api/2/issue/${ticketId}`;
        const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
        try {
            const response = await axios_1.default.get(url, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'Failed to fetch ticket details',
                error: error.response?.data || error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addCommentToTicket(ticketId, comment) {
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
            const response = await axios_1.default.post(url, bodyData, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('response', response);
            return response.body;
        }
        catch (error) {
            console.log('error', error.response?.statusText);
            throw new common_1.HttpException({
                message: 'Failed to add comment to ticket',
                error: error.response?.statusText || error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.JiraService = JiraService;
exports.JiraService = JiraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JiraService);
//# sourceMappingURL=jira.service.js.map