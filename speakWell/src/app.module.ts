import { Module } from '@nestjs/common';
import { FeedbackController } from './controllers/feedback.controller';
import { AudioAnalysisService } from './services/audio.analysis.service';
import { ConfigModule } from '@nestjs/config';
import { VideoAnalysisService } from './services/video.analysis.service';
import { ChatGPTService } from './services/gpt.service';
import { ChatAnalysisService } from './services/chat.analysis.service';
import { JiraController } from './controllers/jira.controller';
import { JiraService } from './services/jira.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [FeedbackController, JiraController],
  providers: [
    VideoAnalysisService,
    AudioAnalysisService,
    ChatGPTService,
    ChatAnalysisService,
    JiraService,
  ],
})
export class AppModule {}
