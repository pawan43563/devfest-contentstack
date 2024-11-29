"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JIRAFILEMAPPER = exports.MODELS = exports.DEFAULT_CHAT_DIR = exports.QROQ_MODAL = exports.GPT_API_URL = exports.MAX_OUTPUT_TOKENS = exports.DEFAULT_KB_DIR = exports.DEFAULT_FRAMES_DIR = exports.DEFAULT_AUDIO_DIR = exports.DEFAULT_FRAMES = exports.FILE_NAME_REGEX = exports.MULTIPART_OPTIONS = void 0;
exports.MULTIPART_OPTIONS = {
    limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 10,
        fileSize: 1073741824,
        files: 1,
        headerPairs: 10,
    },
};
exports.FILE_NAME_REGEX = new RegExp('^[.]+|[`#%^\\+\\\\/\\?\\*:|\\"\\\'<>\\s\\{\\}=,_]+', 'g');
exports.DEFAULT_FRAMES = 25;
exports.DEFAULT_AUDIO_DIR = './uploads/audio';
exports.DEFAULT_FRAMES_DIR = './uploads/frames';
exports.DEFAULT_KB_DIR = "./kb";
exports.MAX_OUTPUT_TOKENS = 500;
exports.GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
exports.QROQ_MODAL = "llama-3.2-90b-vision-preview";
exports.DEFAULT_CHAT_DIR = "./chat_data";
var MODELS;
(function (MODELS) {
    MODELS["GPT_4_TURBO"] = "gpt-4-turbo";
    MODELS["GPT_4_OMNI"] = "gpt-4o";
    MODELS["GPT_WHISPER_1"] = "whisper-1";
})(MODELS || (exports.MODELS = MODELS = {}));
exports.JIRAFILEMAPPER = {
    "CS": "launch",
    "CLOUD": "Launch",
    "MKT": "marketplaceapp"
};
//# sourceMappingURL=app.constants.js.map