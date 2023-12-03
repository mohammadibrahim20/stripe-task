const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const nodemailer = require("nodemailer");
const easyinvoice = require("easyinvoice");
const path = require("path");
const fs = require("fs");
const mg = require("nodemailer-mailgun-transport");
const { assert } = require("console");

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "b4a0fa6dd019c29963fbdb51e03ea85b",
  },
});

// send payment confirmation email
const sendPaymentConfirmationEmail = async (payload) => {
  const info = await transporter.sendMail({
    from: "mailtrap@testing.com",
    to: "mohammadibrahim2224@gmail.com",
    subject: "Your payment is successfully completed",
    text: "Your order has completed",
    html: "<b>Hello world?</b>",
  });
};

// create payment
app.post("/create-checkout-session", async (req, res) => {
  const product = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: product.email,
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/cancel`,
  });
  res.json({ id: session.id });
});

// payment success
app.get("/success", async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // sendPaymentConfirmationEmail(session);
    // makeInvoice(session);
    // sendPaymentConfirmationEmail(session);
    res.send(session);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while retrieving session information.");
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
