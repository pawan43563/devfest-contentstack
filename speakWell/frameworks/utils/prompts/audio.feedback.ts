// export const audioFeedbackPrompt = `A candidate is presenting and telling the issue that he/she is facing. 
//       Organize the response with bullet points and complete sentences. Avoid incomplete sentences.
//       Additionally, summarize the audio content, provide a suitable title, and indicate any urgent issues in one liner.
//       Instructions:
//       Review all frames for a thorough assessment,
//       Summarize the video content in 300 words,
//       Provide a suitable title,
//       Indicate urgency in 1 line if something is not working.`;


export const audioFeedbackPrompt = `You are analyzing an audio file to extract specific information. Follow these instructions:
      * Title:
            Extract the title of the audio based on its main topic or focus.
      * Summary:
            Write a concise summary in 2-3 sentences that captures the core idea of the audio.
      * Description:
            Provide a detailed description of the audio with step by step.
      * Label: 
            If the audio mentions any of the following terms: Algolia, Salesforce, Wordbee, SAP Commerce Cloud or App, assign the label Marketplace App.
            If none of these terms are mentioned, leave the label field blank`