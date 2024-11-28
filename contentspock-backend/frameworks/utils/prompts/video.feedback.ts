export const videoFeedbackPrompt = `A candidate is sharing their screen and recording a demo.  
      Organize the response with complete sentences. Avoid incomplete sentences.
      Additionally, summarize the video content, provide a suitable title, and indicate any urgent issues in one liner.
      Instructions:
      Review all frames for a thorough assessment,
      Summarize the video content in 300 words,
      Provide a suitable title,
      Check the URL in the video If the website URL contains the term launch, assign the label Launch or else blank.
      Organize the response as JSON format
      `

// export const videoFeedbackPrompt = `The video is describing the issue occuring in contentstack. 
//       Identify the problem statement, product with which the issue is occuring. 
//       Summarize the audio content, give a suitable title, description, relative tags and steps that the user has performed to replicate the issue.  
//       A candidate is presenting and telling the issue that he/she is facing. 
//       Instructions:
//       Review all frames for a thorough assessment,
//       Summarize the video content in 300 words, add priority if the user mentioned it.`;

// export const videoFeedbackPrompt = `Review all frames to extract specific information. Follow these instructions:
//       * Title:
//             Extract the title of the video based on its main subject or theme.
//       * Summary:
//             Write a concise summary in 2-3 sentences that captures the core idea of the audio.
//       * Description:
//             Write a detailed description of the video in under 300 words, formatted for use in a JIRA ticket. Ensure clarity and a professional tone.
//       * Label: 
//             Check the URL of the video If the URL contains the term launch, assign the label Launch or else blank.`


// VIDEO
//       title
//       summary
//       desc
//       label
     
// AUDIO
//       title
//       summary
//       desc
//       label

// summary from audio -- 2-3 line
// description from video -- under 300 words -- jira
// title from audio --
// label from? if audiows mentions algolia, salesforce, wordbee or app then label it Marketplace APP and if video has launch in its url then launch label