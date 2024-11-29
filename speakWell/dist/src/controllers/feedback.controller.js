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
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const path = require("path");
const fs_1 = require("fs");
const audio_analysis_service_1 = require("../services/audio.analysis.service");
const video_analysis_service_1 = require("../services/video.analysis.service");
const multipart_1 = require("../../frameworks/middlewares/interceptors/multipart");
const chat_analysis_service_1 = require("../services/chat.analysis.service");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
let FeedbackController = class FeedbackController {
    constructor(videoAnalysisService, audioAnalysisService, chatAnalysisService) {
        this.videoAnalysisService = videoAnalysisService;
        this.audioAnalysisService = audioAnalysisService;
        this.chatAnalysisService = chatAnalysisService;
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
    async getVisualFeedBack(response, body, userId) {
        const filePath = `./chat_data/feedback_${userId}.json`;
        await this.videoAnalysisService.extractFrames(body.path);
        const videoFeedback = await this.videoAnalysisService.getVisualFeedback();
        await this.appendToJsonFile(filePath, 'videoFeedback', videoFeedback);
        return response.status(200).send(videoFeedback);
    }
    async getAudioFeedBack(response, body, userId) {
        const filePath = `./chat_data/feedback_${userId}.json`;
        const audioPath = await this.audioAnalysisService.extractAudioFromVideo(body.path);
        const audioFeedback = await this.audioAnalysisService.analyzeAudio(audioPath);
        await this.appendToJsonFile(filePath, 'audioFeedback', audioFeedback);
        return response.status(200).send(audioFeedback);
    }
    async getChatResolution(response, body, userId) {
        const filePath = `./chat_data/feedback_${userId}.json`;
        const fileData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf-8'));
        let issueLabel = null;
        let parsedBody;
        if (typeof body === 'string') {
            try {
                parsedBody = JSON.parse(body);
            }
            catch (error) {
                parsedBody = null;
            }
        }
        else {
            parsedBody = body;
        }
        if (!parsedBody?.issueLabel) {
            const filePath = path.join(app_constants_1.DEFAULT_CHAT_DIR, `feedback_${userId}.json`);
            console.info("file", filePath);
            const fileContent = (0, fs_1.readFileSync)(filePath, 'utf-8');
            return response.status(200).send({ fileContent });
        }
        else {
            issueLabel = parsedBody.issueLabel;
            await this.appendToJsonFile(filePath, 'issueLabel', issueLabel);
            const chatFeedback = await this.chatAnalysisService.extractData(parsedBody, fileData);
            await this.appendToJsonFile(filePath, 'chatFeedback', chatFeedback);
            return response.status(200).send(chatFeedback);
        }
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(['/visual', '/video']),
    (0, common_1.UseInterceptors)(multipart_1.MultipartInterceptor),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getVisualFeedBack", null);
__decorate([
    (0, common_1.Post)('/audio'),
    (0, common_1.UseInterceptors)(multipart_1.MultipartInterceptor),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getAudioFeedBack", null);
__decorate([
    (0, common_1.Post)('/chat'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getChatResolution", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('/feedback'),
    __metadata("design:paramtypes", [video_analysis_service_1.VideoAnalysisService,
        audio_analysis_service_1.AudioAnalysisService,
        chat_analysis_service_1.ChatAnalysisService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map