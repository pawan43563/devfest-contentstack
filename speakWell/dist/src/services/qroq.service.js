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
exports.QROQService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let QROQService = class QROQService {
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('QROK_API_KEY');
    }
    async chatCompletion(model, messages) {
        try {
            const client = new groq_sdk_1.default({
                apiKey: this.apiKey,
            });
            const response = await client.chat.completions.create({
                model,
                messages
            });
            return Promise.resolve(response.choices[0]?.message?.content);
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
exports.QROQService = QROQService;
exports.QROQService = QROQService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QROQService);
//# sourceMappingURL=qroq.service.js.map