"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleConfig = void 0;
const path = require("path");
exports.moduleConfig = {
    envFilePath: path.join(__dirname, '../../../..', (process.env.NODE_ENV || 'development') + '.env'),
    load: [],
    isGlobal: true,
};
//# sourceMappingURL=env.js.map