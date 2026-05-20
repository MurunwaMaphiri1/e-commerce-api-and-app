import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../types/user.ts";

const usersSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Users: Model<IUser> = mongoose.model<IUser>("Users", usersSchema);

export default Users;