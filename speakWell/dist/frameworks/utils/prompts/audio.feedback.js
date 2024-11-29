"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioFeedbackPrompt = void 0;
exports.audioFeedbackPrompt = `You are analyzing an audio file to extract specific information. Follow these instructions:
      * Title:
            Extract the title of the audio based on its main topic or focus.
      * Summary:
            Write a concise summary in 2-3 sentences that captures the core idea of the audio.
      * Description:
            Provide a detailed description of the audio with step by step.
      * Label: 
            If the audio mentions any of the following terms: Algolia, Salesforce, Wordbee, SAP Commerce Cloud or App, assign the label Marketplace App.
            If none of these terms are mentioned, leave the label field blank`;
//# sourceMappingURL=audio.feedback.js.map