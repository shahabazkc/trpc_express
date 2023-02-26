import UserModel from "./userModel";
import { Bcrypt, DBService } from '@dev-compiler/common';
const DB = new DBService();
import * as constants from '../../utils/constants';
import { TRPCError } from "@trpc/server";

export default {
    loginUser: async (req) => {
        const { email_id, password } = req.input;
        const emailExist = await DB.getOneByQuery(
            constants.COLLECTIONS.USER_COLLECTION,
            { email_id },
            { noErr: true }
        );
        if (!emailExist) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User does not exist', cause: '' });
        };
        try {
            await Bcrypt.compare(password, emailExist.password);
        }
        catch (err) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Password does not match', cause: '' });
        }
        return { status: true, message: 'Login Success' };
    },
    createUser: async (req) => {
        const userExist = await DB.getOneByQuery(constants.COLLECTIONS.USER_COLLECTION, { email_id: req.input.email_id }, { noErr: true });
        if (userExist) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User already exist', cause: '' });
        };
        req.input.email_id = req.input.email_id.toLowerCase();
        return await UserModel.create(req.input);
    }
}