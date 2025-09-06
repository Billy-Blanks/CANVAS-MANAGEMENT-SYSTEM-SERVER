import mongoose, { Schema, model, Model, Document } from "mongoose";

// User Interface Definition
export interface UserInterface extends Document {
    userType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    roomNumber: string;
    position: boolean;
}

// Define Schema
const userSchema = new Schema<UserInterface>(
    {
        userType: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        roomNumber: { type: String, required: true },
        position: { type: Boolean, required: true },
    },
    { timestamps: true }
);


// Export Model with Type Checking
export const UserModel: Model<UserInterface> =
    mongoose.models.User || model<UserInterface>("User", userSchema);