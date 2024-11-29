"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const mimeTypes = require("mime-types");
const mimetype_1 = require("../../utils/resources/mimetype");
const app_constants_1 = require("../../utils/resources/app.constants");
let MultipartInterceptor = class MultipartInterceptor {
    async intercept(context, next) {
        try {
            const request = context.switchToHttp().getRequest();
            const files = await request.saveRequestFiles(app_constants_1.MULTIPART_OPTIONS);
            if (files && !this.validateFiles(files)) {
                throw this.generateError({
                    name: 'Invalid File',
                    message: "is required and should'nt be empty",
                    fieldname: 'upload',
                });
            }
            let bodyData = {};
            for (const file of files) {
                if (file.mimetype && !this.isValidVideoMimeType(file.filename)) {
                    const response = {
                        error: {
                            message: `File couldn't be processed at this moment`,
                            mimetype: 'is not supported',
                        },
                    };
                    context.switchToHttp().getResponse().status(400).send(response);
                    return (0, rxjs_1.of)(response);
                }
                bodyData = {
                    type: file.type,
                    originalName: file.filename.replace(app_constants_1.FILE_NAME_REGEX, '_'),
                    mimetype: file.mimetype,
                    path: file.filepath,
                    encoding: file.encoding,
                    size: file.file.bytesRead,
                };
            }
            request.body = bodyData;
            return next.handle().pipe((0, operators_1.tap)());
        }
        catch (err) {
            const response = {
                error: {
                    message: "File could'nt be processed at this moment",
                    [err?.part?.fieldname || err?.fieldname || 'upload']: err.message,
                },
            };
            context.switchToHttp().getResponse().status(400).send(response);
            return (0, rxjs_1.of)(response);
        }
    }
    validateFiles(files) {
        const isFilePresent = files.filter((file) => file.type === 'file' && file.file.bytesRead > 0);
        return isFilePresent[0];
    }
    generateError(data) {
        const err = new Error(data.name || 'Bad Request');
        err.message = data.message || '';
        err.stack = data.stack || {};
        err['fieldname'] = data.fieldname || '';
        return err;
    }
    getFieldnameWithoutBrackets(fieldname) {
        return fieldname.replace(/\[.*\]/, '');
    }
    isValidVideoMimeType(filename) {
        const mimeType = mimeTypes.lookup(filename);
        return mimetype_1.VIDEO_MIMETYPE.includes(mimeType);
    }
};
exports.MultipartInterceptor = MultipartInterceptor;
exports.MultipartInterceptor = MultipartInterceptor = __decorate([
    (0, common_1.Injectable)()
], MultipartInterceptor);
//# sourceMappingURL=multipart.js.map