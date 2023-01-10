import mongoose, {Schema, Document, Model} from "mongoose";
import {SessionProps} from "./session.model";

const userSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: "Session"
    }],
    likes: [{
        type: Schema.Types.String
    }],
    wishlist: [{
        type: Schema.Types.String
    }]
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    _id: string;
    email: string;
    password: string;
    sessions: string[] | SessionProps[];
    likes: string[],
    wishlist: string[]
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
