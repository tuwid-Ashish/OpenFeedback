import mongoose, { Document, Schema } from "mongoose";

interface Messages extends Document {
    content: string;
    createdAt: Date;
}

const MessagesSchema: Schema<Messages> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

interface User {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isAcceptMessage: boolean;
    isverified: boolean;
    messages: Messages[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required']
    },
    verifyCodeExpire: {
        type: Date,
        required: true
    },
    isAcceptMessage: {
        type: Boolean, 
        required: true,
        default: true
    },
    isverified: {
        type: Boolean,
        required: true,
        default: false
    },
    messages: [MessagesSchema],
});

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default User