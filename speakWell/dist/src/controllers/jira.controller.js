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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const fs_1 = require("fs");
const jira_service_1 = require("../services/jira.service");
const gpt_service_1 = require("../services/gpt.service");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
const path = require("path");
const fs_2 = require("fs");
let JiraController = class JiraController {
    constructor(jiraService, chatGptService) {
        this.jiraService = jiraService;
        this.chatGptService = chatGptService;
    }
    async appendToJsonFile(filePath, key, data) {
        await fs.mkdir('./chat_data', { recursive: true });
        if (!(0, fs_1.existsSync)(filePath)) {
            await fs.writeFile(filePath, JSON.stringify({}, null, 2), 'utf8');
        }
        const fileContent = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        jsonData[key] = data;
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    }
    async getTicketSummary(userId) {
        try {
            const ticketDetails = await this.jiraService.getTicketSummary(userId);
            return {
                ticket: ticketDetails,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'Failed to get details for the Jira ticket',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTicket(ticketDetails, userId) {
        try {
            const filePath = `./chat_data/feedback_${userId}.json`;
            const result = await this.jiraService.createTicket(ticketDetails);
            await this.appendToJsonFile(filePath, 'jira_ticket', result);
            return {
                message: 'Ticket created successfully',
                ticket: result,
            };
        }
        catch (error) {
            console.info("Error", error);
            throw new common_1.HttpException({
                message: 'Failed to create Jira ticket',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async postUpdates(ticketId, comment) {
        try {
            console.info("comment", comment);
            const response = await this.jiraService.addCommentToTicket(ticketId, comment);
            console.log("Response", response);
            return {
                message: "Added successfully"
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'Failed to fetch ticket details',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async statusWebhook(issueId, issueKey, projectKey) {
        if (!issueId || !issueKey) {
            throw new common_1.HttpException({ message: 'ticketId and key are required query parameters' }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const ticketDetails = await this.jiraService.getTicketDetails(issueKey);
            const ticketDesciption = ticketDetails?.fields?.description;
            const ticketCommentsArr = [];
            ticketDetails?.fields?.comment?.comments?.forEach((cmt) => {
                ticketCommentsArr?.push(cmt?.body);
            });
            const ticketComments = ticketCommentsArr?.join("");
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
            const response = await this.chatGptService.chatCompletion(app_constants_1.MODELS.GPT_4_TURBO, messages);
            console.info("REsponse", response);
            let filePath;
            const folderPath = path.join(app_constants_1.DEFAULT_KB_DIR);
            const files = (0, fs_2.readdirSync)(folderPath);
            const matchingFile = files.find((file) => file.includes(app_constants_1.JIRAFILEMAPPER[projectKey]));
            if (matchingFile) {
                filePath = path.join(folderPath, matchingFile);
            }
            else {
            }
            (0, fs_2.writeFileSync)(filePath, response, { flag: 'a' });
            console.info("Q&A summary saved to KB file:", filePath);
            return Promise.resolve("Added Successfully");
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'Failed to fetch ticket details',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.JiraController = JiraController;
__decorate([
    (0, common_1.Get)('get-ticket-summary'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JiraController.prototype, "getTicketSummary", null);
__decorate([
    (0, common_1.Post)('create-ticket'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JiraController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Post)('comments'),
    __param(0, (0, common_1.Query)('ticketId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JiraController.prototype, "postUpdates", null);
__decorate([
    (0, common_1.Post)('status-webhook'),
    __param(0, (0, common_1.Query)('issueId')),
    __param(1, (0, common_1.Query)('issueKey')),
    __param(2, (0, common_1.Query)('projectKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], JiraController.prototype, "statusWebhook", null);
exports.JiraController = JiraController = __decorate([
    (0, common_1.Controller)('jira'),
    __metadata("design:paramtypes", [jira_service_1.JiraService,
        gpt_service_1.ChatGPTService])
], JiraController);
//# sourceMappingURL=jira.controller.js.map