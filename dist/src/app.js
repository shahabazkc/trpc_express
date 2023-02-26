"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_1 = __importDefault(require("http-status"));
const common_1 = require("@dev-compiler/common");
const app = (0, express_1.default)();
app.disable("x-powered-by"); // For security
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || "SECRET"));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    common_1.log.info(`Path not Exist: ${req.path}`);
    next(new common_1.ApiError(http_status_1.default.NOT_FOUND, "Not found"));
});
app.use(common_1.errorConverter);
app.use(common_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map