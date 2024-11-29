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
exports.ChatGPTService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
let ChatGPTService = class ChatGPTService {
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('OPENAI_API_KEY');
    }
    async chatCompletion(model, messages) {
        try {
            const response = await axios_1.default.post(app_constants_1.GPT_API_URL, {
                model,
                messages,
                max_tokens: app_constants_1.MAX_OUTPUT_TOKENS,
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            const jsonRes = JSON.parse(JSON.stringify(response.data.choices));
            return Promise.resolve(jsonRes[0].message.content);
        }
        catch (error) {
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            }
            else {
                console.error('Error message:', error.message);
            }
            return 'Something went wrong';
        }
    }
};
exports.ChatGPTService = ChatGPTService;
exports.ChatGPTService = ChatGPTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatGPTService);
//# sourceMappingURL=gpt.service.js.map