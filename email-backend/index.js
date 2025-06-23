const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is alive");
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
});

app.post("/send-email", async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: "Missing fields" });

  try {
    await transporter.sendMail({
      from: `"Email App" <${process.env.SMTP_USER}>`,
      to,
      subject: "Message from Email App",
      html: message,
    });

    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
