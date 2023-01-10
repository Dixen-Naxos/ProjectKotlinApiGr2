import {UserDocument, UserModel, UserProps} from "../models";
import {SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models";
import {Session} from "inspector";
import fs from "fs";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() {
    }

    public async subscribeUser(user: Partial<UserProps>): Promise<UserDocument> {

        if (!user.password) {
            throw new Error('Missing password');
        }
        const model = new UserModel({
            email: user.email,
            password: SecurityUtils.sha512(user.password),
            likes: user.likes,
            wishlist: user.wishlist
        });
        return model.save();
    }

    public async logIn(info: Pick<UserProps, 'email' | 'password'>, platform: string): Promise<SessionDocument | null> {
        const user = await UserModel.findOne({
            email: info.email,
            password: SecurityUtils.sha512(info.password),
        }).exec();
        if (user === null) {
            throw new Error('User not found');
        }

        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }

    async getById(userId: string): Promise<UserDocument | null> {
        return UserModel.findById(userId).exec();
    }

    async getByEmail(email: string): Promise<UserDocument[] | null> {
        return UserModel.find({email: email}).exec();
    }

    async getByIdPopulate(userId: string): Promise<UserDocument | null> {
        return UserModel.findById(userId).exec();
    }

    async updateById(userId: string, props: UserProps): Promise<UserDocument | null> {
        const user = await this.getById(userId);
        if (!user) {
            return null;
        }
        if (props.email !== undefined) {
            if (props.email.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
                user.email = props.email;
            }
        }
        if (props.password !== undefined) {
            user.password = SecurityUtils.sha512(props.password);
        }
        const res = await user.save();
        return res;
    }

    public async getUserFrom(token: string): Promise<UserProps | null> {
        const session = await SessionModel.findOne({
            _id: token,
            expiration: {
                $gte: new Date()
            }
        }).populate("user").exec();
        return session ? session.user as UserProps : null;
    }

    async deleteById(userId: string): Promise<boolean> {

        const user = await this.getByIdPopulate(userId);
        let success;

        if (!user)
            return false;

        await SessionModel.deleteMany({user: userId});

        const res = await UserModel.deleteOne({_id: userId}).exec();
        return res.deletedCount === 1;
    }

    async disconnect(token: string): Promise<boolean> {
        const res = await SessionModel.deleteOne({_id: token}).exec();
        return res.deletedCount === 1;
    }
}
