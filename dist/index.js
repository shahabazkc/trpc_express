"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@dev-compiler/common");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const config_1 = __importDefault(require("./src/config/config"));
const DB = new common_1.Database();
const exitHandler = (error) => {
    common_1.log.info(error);
    process.exit(1);
};
const unexpectedErrorHandler = (err) => {
    exitHandler(err);
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGINT", () => {
    DB.disconnect();
    common_1.log.info(`${config_1.default.APP_NAME}: Connection to database closed due to nodejs process termination`);
    // eslint-disable-next-line no-process-exit
    process.exit(0);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DB.connect({
            mongoUri: config_1.default.MONGO_URI,
            host: config_1.default.HOST,
            name: config_1.default.APP_NAME,
            port: config_1.default.MONGO_DB_PORT,
            opts: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            replSet: ''
        });
    }
    catch (err) {
        common_1.log.info("Error while connecting to database");
        common_1.log.error(err);
        process.exit(1);
    }
    app_1.default.listen(config_1.default.PORT, () => {
        common_1.log.info(`${config_1.default.APP_NAME} is started on port: ${config_1.default.PORT}`);
    });
});
startServer();
//# sourceMappingURL=index.js.map