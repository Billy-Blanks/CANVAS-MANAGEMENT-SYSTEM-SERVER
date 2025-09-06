import express from "express";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "./schema/user.mjs";
import { PaymentModel } from "./schema/payment.mjs";
import { DateTime } from "luxon";
import formatKenyanPhoneNumber from "./utilities/formatKenyanPhoneNumber.mjs";

const app = express();
const upload = multer();

mongoose.connect("mongodb://localhost:27017/RMS");

app.use(express.json());

app.post("/register", cors(), upload.none(), async function (req, res) {
  const existing = await UserModel.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (existing) {
    res
      .status(200)
      .json({ error: "User with this email or phone already exists." });
    return;
  }
  const hash = await bcrypt.hash(req.body.password, 12);
  const user = new UserModel({ ...req.body, position: true, password: hash });
  await user.save();
  res.status(200).json("We received your data");
});

app.post("/login", cors(), upload.none(), async function (req, res) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    res.status(200).json({ error: "User not found" });
    return;
  }
  const hash = await bcrypt.compare(req.body.password, user.password);
  if (!hash) {
    res.status(200).json({ error: "Please check your password" });
    return;
  }
  res.status(200).json(user);
});

app.post("/pay", cors(), async function (req, res) {
  console.log("Payment request received", req.body);

  const { phone, id, amount,name } = req.body;

  const timestamp = DateTime.now().toFormat("yyyyMMddhhmmss");

  const payload = {
    BusinessShortCode: 174379,
    Password:
      "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjUwOTA0MTg0ODUy",
    Timestamp: "20250904184852",
    TransactionType: "CustomerPayBillOnline",
    Amount: parseInt(amount),
    PartyA: formatKenyanPhoneNumber(phone),
    PartyB: 174379,
    PhoneNumber: formatKenyanPhoneNumber(phone),
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "Billy LTD",
    TransactionDesc: "Payment of rent",
  };

  const resp = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer CAhYAhTPjipIf1IH6o0qMpz2U4ry
`,
      },
      body: JSON.stringify(payload),
    }
  );

  const newPayment = new PaymentModel({
    name: name,
    paymentId: id,
    date: DateTime.now().toISO(),
    amount: payload.Amount,
    status: "Paid",
    method: "MPESA",
  });

  await newPayment.save();

  if (!resp.ok) {
    const errorBody = await resp.text();
    throw new Error(
      `MPESA request failed: ${resp.status} ${resp.statusText} - ${errorBody}`
    );
  }

  const data = await resp.json();
  res.status(200).json(data);
});

app.use("/payments", cors(), async function (_, res) {
  const payments = await PaymentModel.find();
  res.status(200).json(payments);
});

app.use("/", cors(), (req, res) => {
  res.send("Billy app is running well");
});

console.log("I am up and running billy");

app.listen(3000);
