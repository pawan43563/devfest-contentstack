"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const feedback_controller_1 = require("./controllers/feedback.controller");
const audio_analysis_service_1 = require("./services/audio.analysis.service");
const config_1 = require("@nestjs/config");
const video_analysis_service_1 = require("./services/video.analysis.service");
const gpt_service_1 = require("./services/gpt.service");
const chat_analysis_service_1 = require("./services/chat.analysis.service");
const jira_controller_1 = require("./controllers/jira.controller");
const jira_service_1 = require("./services/jira.service");
const qroq_service_1 = require("./services/qroq.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [feedback_controller_1.FeedbackController, jira_controller_1.JiraController],
        providers: [
            video_analysis_service_1.VideoAnalysisService,
            audio_analysis_service_1.AudioAnalysisService,
            gpt_service_1.ChatGPTService,
            chat_analysis_service_1.ChatAnalysisService,
            jira_service_1.JiraService,
            qroq_service_1.QROQService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map