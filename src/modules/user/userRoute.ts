import { ApiError, DBService } from '@dev-compiler/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import UserModel from './userModel';
import * as constants from '../../utils/constants';
import controller from './controller';

const DB = new DBService();
export const t = initTRPC.create();

export const userRouter = t.router({

    login: t.procedure.input(
        z.object({ email_id: z.string().email(), password: z.string().min(5) })
    ).mutation(controller.loginUser),

    createUser: t.procedure
        .input(z.object({
            name: z.string().min(5),
            email_id: z.string().email(),
            password: z.string().min(5),
            mobile_number: z.string().min(10),
            username: z.string().min(5),
        }))
        .mutation(controller.createUser),

    greeting: t.procedure.query(() => 'hello tRPC v10!'),
});
// export type definition of API
export type AppRouter = typeof userRouter;