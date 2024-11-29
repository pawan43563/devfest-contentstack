export declare const MULTIPART_OPTIONS: {
    limits: {
        fieldNameSize: number;
        fieldSize: number;
        fields: number;
        fileSize: number;
        files: number;
        headerPairs: number;
    };
};
export declare const FILE_NAME_REGEX: RegExp;
export declare const DEFAULT_FRAMES = 25;
export declare const DEFAULT_AUDIO_DIR = "./uploads/audio";
export declare const DEFAULT_FRAMES_DIR = "./uploads/frames";
export declare const DEFAULT_KB_DIR = "./kb";
export declare const MAX_OUTPUT_TOKENS = 500;
export declare const GPT_API_URL = "https://api.openai.com/v1/chat/completions";
export declare const QROQ_MODAL = "llama-3.2-90b-vision-preview";
export declare const DEFAULT_CHAT_DIR = "./chat_data";
export declare enum MODELS {
    GPT_4_TURBO = "gpt-4-turbo",
    GPT_4_OMNI = "gpt-4o",
    GPT_WHISPER_1 = "whisper-1"
}
export declare const JIRAFILEMAPPER: {
    CS: string;
    CLOUD: string;
    MKT: string;
};
