import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import { ApiError, errorConverter, errorHandler, log } from '@dev-compiler/common';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { userRouter } from './modules/user/userRoute';
import superjson from 'superjson';
const app = express();


app.disable("x-powered-by"); // For security
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "SECRET"));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const createContext = ({
    req,
    res
}: trpcExpress.CreateExpressContextOptions) => ({});

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create({
    transformer: superjson,
    isDev: process.env.NODE_ENV === 'development',
    isServer: true,
    allowOutsideOfServer: false,
});
const router = t.router;

const appRouter = router({
    user: userRouter
});

app.use(
    '/api/user',
    trpcExpress.createExpressMiddleware({
        router: appRouter.user,
        createContext,
    }),
)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    log.info(`Path not Exist: ${req.path}`);
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);


export default app;

