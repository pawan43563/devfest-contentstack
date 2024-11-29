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
exports.VideoAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs-extra");
const jimp_1 = require("jimp");
const video_feedback_1 = require("../../frameworks/utils/prompts/video.feedback");
const gpt_service_1 = require("./gpt.service");
const app_constants_1 = require("../../frameworks/utils/resources/app.constants");
let VideoAnalysisService = class VideoAnalysisService {
    constructor(chatGptService) {
        this.chatGptService = chatGptService;
    }
    async getVideoDurationInFrames(inputVideoPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
                if (err) {
                    return reject(new Error(`Error reading metadata: ${err.message}`));
                }
                try {
                    const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
                    if (!videoStream) {
                        throw new Error('No video stream found in the file');
                    }
                    const frameRateStr = videoStream.r_frame_rate;
                    const durationStr = videoStream.duration;
                    if (!frameRateStr || !durationStr) {
                        throw new Error('Frame rate or duration is not defined in metadata');
                    }
                    const [num, denom] = frameRateStr.split('/');
                    const fps = parseInt(num, 10) / parseInt(denom, 10);
                    const duration = parseFloat(durationStr);
                    if (isNaN(fps) || isNaN(duration)) {
                        throw new Error('Failed to parse frame rate or duration');
                    }
                    const totalFrames = Math.floor(fps * duration);
                    resolve(totalFrames);
                }
                catch (parseError) {
                    reject(parseError);
                }
            });
        });
    }
    async extractFrames(inputVideoPath, numFrames = app_constants_1.DEFAULT_FRAMES, outputDir = app_constants_1.DEFAULT_FRAMES_DIR) {
        await fs.ensureDir(outputDir);
        await fs.emptyDir(outputDir);
        try {
            const totalFrames = await this.getVideoDurationInFrames(inputVideoPath);
            const interval = Math.floor(totalFrames / numFrames);
            console.log(`Total frames: ${totalFrames}, Interval: ${interval}`);
            return new Promise((resolve, reject) => {
                ffmpeg(inputVideoPath)
                    .on('end', () => {
                    console.log('Frame extraction completed');
                    resolve();
                })
                    .on('error', (err) => {
                    console.error('Error during frame extraction:', err);
                    reject(err);
                })
                    .on('filenames', (filenames) => {
                    console.log('Extracting frames:', filenames);
                })
                    .output(path.join(outputDir, 'frame-%04d.png'))
                    .outputOptions([
                    `-vf select='not(mod(n\\,${interval}))'`,
                    `-vsync vfr`,
                    `-frames:v ${numFrames}`,
                ])
                    .run();
            });
        }
        catch (error) {
            console.error('Error calculating total frames:', error);
        }
    }
    prepareFramesForGPT(base64Frames) {
        return base64Frames.map((frame) => ({ image: frame, resize: 768 }));
    }
    async getVisualFeedback(framesDir) {
        framesDir = framesDir ? framesDir : app_constants_1.DEFAULT_FRAMES_DIR;
        const frameFiles = fs
            .readdirSync(framesDir)
            .map((file) => path.join(framesDir, file));
        const resizedFrames = await Promise.all(frameFiles.map(async (frame) => {
            const image = await jimp_1.default.read(frame);
            image.scaleToFit(768, 768);
            const imageBuffer = await image.getBufferAsync(jimp_1.default.MIME_PNG);
            return imageBuffer.toString('base64');
        }));
        try {
            const messages = [
                {
                    role: 'user',
                    content: [
                        video_feedback_1.videoFeedbackPrompt,
                        ...this.prepareFramesForGPT(resizedFrames),
                    ],
                },
            ];
            const response = await this.chatGptService.chatCompletion(app_constants_1.MODELS.GPT_4_OMNI, messages);
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
exports.VideoAnalysisService = VideoAnalysisService;
exports.VideoAnalysisService = VideoAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gpt_service_1.ChatGPTService])
], VideoAnalysisService);
//# sourceMappingURL=video.analysis.service.js.map