// export const videoFeedbackPrompt = `A candidate is sharing their screen and recording a demo.  
//       Organize the response with bullet points and complete sentences. Avoid incomplete sentences.
//       Additionally, summarize the video content, provide a suitable title, and indicate any urgent issues in one liner.
//       Instructions:
//       Review all frames for a thorough assessment,
//       Summarize the video content in 300 words,
//       Provide a suitable title,
//       Indicate urgency in 1 line if something is not working.`;

export const videoFeedbackPrompt = `The video is describing the issue occuring in contentstack. 
      Identify the problem statement, product with which the issue is occuring. 
      Summarize the audio content, give a suitable title, description, relative tags and steps that the user has performed to replicate the issue.  
      A candidate is presenting and telling the issue that he/she is facing. 
      Instructions:
      Review all frames for a thorough assessment,
      Summarize the video content in 300 words, add priority if the user mentioned it.`;