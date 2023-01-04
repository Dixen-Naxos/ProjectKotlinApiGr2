import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    platform: {
        type: Schema.Types.String,
        required: true
    },
    expiration: {
        type: Schema.Types.Date
    }
}, {
    collection: "sessions",
    timestamps: true,
    versionKey: false
});

export interface SessionProps {
    _id: string;
    user: string | UserProps;
    platform: string;
    expiration?: Date;
}

export type SessionDocument = SessionProps & Document;
export const SessionModel: Model<SessionDocument> = mongoose.model<SessionDocument>("Session", sessionSchema);
