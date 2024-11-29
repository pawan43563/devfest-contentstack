"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('ApplicationBootstrap');
    const fastify = new platform_fastify_1.FastifyAdapter({});
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastify, { bufferLogs: true });
    await app.register(await require('@fastify/multipart'));
    process.on('uncaughtException', (exception) => {
        console.log('>>>>>>', exception);
        app.close();
        logger.log(exception);
        logger.log('Server stopped suddenly due to some uncaught exception');
        process.exit(0);
    });
    process.on('unhandledRejection', (exception) => {
        console.log('>>>>>>', exception);
        app.close();
        logger.log('Server stopped suddenly due to some unhandled rejection');
        process.exit(0);
    });
    process.on('SIGINT', () => {
        app.close();
        logger.log('Server terminated gracefully');
        process.exit(0);
    });
    await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map