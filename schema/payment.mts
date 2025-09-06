import mongoose, { Schema, model, Model, Document } from "mongoose";

// User Interface Definition
export interface PaymentInterface extends Document {
  paymentId: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  name: string;
}

// Define Schema
const paymentSchema = new Schema<PaymentInterface>(
  {
    paymentId: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    method: { type: String, required: true },
  },
  { timestamps: true }
);

// Export Model with Type Checking
export const PaymentModel: Model<PaymentInterface> =
  mongoose.models.Payment || model<PaymentInterface>("Payment", paymentSchema);
