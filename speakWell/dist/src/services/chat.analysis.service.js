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
exports.ChatAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const qroq_service_1 = require("./qroq.service");
const gpt_service_1 = require("./gpt.service");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path = require("path");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
const functions_1 = require("../../frameworks/utils/functions");
let ChatAnalysisService = class ChatAnalysisService {
    constructor(configService, chatGptService, QROQService) {
        this.configService = configService;
        this.chatGptService = chatGptService;
        this.QROQService = QROQService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async extractLabel(fileData) {
        console.info(fileData, 'fileData', typeof fileData);
        const labelMatch = fileData.audioFeedback.match(/- Label:\s*(.+)/);
        const issueLabel = labelMatch ? labelMatch[1].trim() : null;
        console.log(issueLabel, 'issueLabel');
        return issueLabel;
    }
    async extractData(body, fileData) {
        let KBResponse;
        const folderPath = path.join(app_constants_1.DEFAULT_KB_DIR);
        const files = (0, fs_1.readdirSync)(folderPath);
        const matchingFile = files.find((file) => file.includes((0, functions_1.toLowercaseAndRemoveSpaces)(body.issueLabel)));
        console.log("ma", matchingFile);
        if (matchingFile) {
            const filePath = path.join(folderPath, matchingFile);
            KBResponse = (0, fs_1.readFileSync)(filePath, 'utf-8');
        }
        else {
            KBResponse = await this.analyzeWithGPT35(KBResponse, body.summary);
        }
        console.log("kb", KBResponse);
        const summary = (0, functions_1.extractSummary)(fileData?.audioFeedback);
        const analysisResponse = await this.analyzeWithGPT35(summary, KBResponse);
        return analysisResponse;
    }
    async analyzeWithGPT35(body, KBResponse) {
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
            const response = await this.chatGptService.chatCompletion(app_constants_1.MODELS.GPT_4_TURBO, messages);
            return Promise.resolve(response);
        }
        catch (error) {
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            }
            else {
                console.error('Error message:', error.message);
            }
            return Promise.reject(error);
        }
    }
    async analyzeWithGroq(body, KBResponse) {
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
            const response = await this.QROQService.chatCompletion(app_constants_1.QROQ_MODAL, messages);
            return Promise.resolve(response);
        }
        catch (error) {
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            }
            else {
                console.error('Error message:', error.message);
            }
            return Promise.reject(error);
        }
    }
};
exports.ChatAnalysisService = ChatAnalysisService;
exports.ChatAnalysisService = ChatAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        gpt_service_1.ChatGPTService,
        qroq_service_1.QROQService])
], ChatAnalysisService);
//# sourceMappingURL=chat.analysis.service.js.map