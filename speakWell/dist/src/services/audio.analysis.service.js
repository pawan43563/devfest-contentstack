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
exports.AudioAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs-extra");
const openai_1 = require("openai");
const audio_feedback_1 = require("../../frameworks/utils/prompts/audio.feedback");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const gpt_service_1 = require("./gpt.service");
const config_1 = require("@nestjs/config");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
let AudioAnalysisService = class AudioAnalysisService {
    constructor(configService, chatGptService) {
        this.configService = configService;
        this.chatGptService = chatGptService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async extractAudioFromVideo(filePath) {
        const videoFileName = path.basename(filePath, path.extname(filePath));
        const audioPath = path.join(app_constants_1.DEFAULT_AUDIO_DIR, `${videoFileName}.mp3`);
        await fs.ensureDir(app_constants_1.DEFAULT_AUDIO_DIR);
        await fs.emptyDir(app_constants_1.DEFAULT_AUDIO_DIR);
        await this.extractAudio(filePath, audioPath);
        return audioPath;
    }
    async extractAudio(videoPath, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    console.error(`Error during ffprobe: ${err.message}`);
                    reject(err);
                    return;
                }
                const audioStream = metadata.streams.find((stream) => stream.codec_type === 'audio');
                if (!audioStream) {
                    reject(new Error('No audio stream found in the video file'));
                    return;
                }
                ffmpeg(videoPath)
                    .output(outputPath)
                    .noVideo()
                    .audioCodec('libmp3lame')
                    .on('end', () => {
                    console.log('Audio extraction and compression finished.');
                    resolve();
                })
                    .on('error', (err) => {
                    console.error(`Error during audio extraction: ${err.message}`);
                    reject(err);
                })
                    .run();
            });
        });
    }
    async analyzeAudio(audioFilePath) {
        try {
            const audioTranscription = await this.transcribeAudio(audioFilePath);
            const analysisResponse = await this.analyzeWithGPT35(audioTranscription);
            return analysisResponse;
        }
        catch (error) {
            console.error('Error analyzing audio:', error);
            throw error;
        }
    }
    async transcribeAudio(audioFilePath) {
        const transcription = await this.openai.audio.translations.create({
            file: fs.createReadStream(audioFilePath),
            model: app_constants_1.MODELS.GPT_WHISPER_1,
        });
        return transcription.text;
    }
    async analyzeWithGPT35(translation) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: audio_feedback_1.audioFeedbackPrompt,
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `The audio transcription/translation is: ${translation}`,
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
};
exports.AudioAnalysisService = AudioAnalysisService;
exports.AudioAnalysisService = AudioAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        gpt_service_1.ChatGPTService])
], AudioAnalysisService);
//# sourceMappingURL=audio.analysis.service.js.map