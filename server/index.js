require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const connectDB = require("./config/db");
const Email = require("./models/Email");
const { GoogleGenerativeAI } = require( "@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); // Connect to MongoDB
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});
// Load Routes
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

const emailRoutes = require("./routes/email");
app.use("/api/emails", emailRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Onebox Email Aggregator API is running...");
});

const imap = new Imap({
  user: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }, // Disable SSL verification
});

function categorizeEmail(email) {
    const subject = email.subject.toLowerCase();
  
    if (subject.includes("spam") || subject.includes("offer") || subject.includes("lottery")) {
      return "Spam";
    }
    if (subject.includes("out of office") || subject.includes("vacation") || subject.includes("leave")) {
      return "Out of Office";
    }
    return "Inbox";
  }
  function fetchEmails() {
    imap.connect();
  
    imap.once("ready", function () {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          console.error("❌ Error opening INBOX:", err);
          return;
        }
  
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const searchCriteria = ["UNSEEN", ["SINCE", thirtyDaysAgo.toISOString().split('T')[0]]];
  
        imap.search(searchCriteria, (err, results) => {
          if (err) {
            console.error("❌ Error searching emails:", err);
            return;
          }
          if (!results || results.length === 0) {
            console.log("📭 No new emails.");
            imap.end();
            return;
          }
  
          const fetch = imap.fetch(results, { bodies: "" });
  
          fetch.on("message", function (msg, seqno) {
            msg.on("body", function (stream, info) {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error("❌ Error parsing email:", err);
                  return;
                }
  
                const category = categorizeEmail(parsed); // Categorize email
  
                const emailData = {
                  sender: parsed.from.text,
                  subject: parsed.subject,
                  body: parsed.text,
                  receivedAt: new Date(),
                  folder: "INBOX",
                  category: category,
                };
  
                // Save email in MongoDB
                try {
                  await Email.create(emailData);
                  console.log(`📩 New ${category} Email: ${parsed.subject}`);
                } catch (dbErr) {
                  console.error("❌ Error saving email:", dbErr);
                }
              });
            });
          });
  
          fetch.once("end", function () {
            console.log("✅ Emails Fetched!");
            imap.end();
          });
        });
      });
    });
  
    imap.on("error", function (err) {
      console.error("IMAP Fetch Error:", err);
    });
  
    imap.on("end", function () {
      console.log("📴 IMAP Connection Ended");
    });
  }
  
  // Fetch emails every 5 minutes
  setInterval(fetchEmails, 5 * 60 * 1000);
  fetchEmails();
  
  // Fetch emails every 5 minutes
  setInterval(fetchEmails, 5 * 60 * 1000);
  fetchEmails();
  

// Fetch emails every 5 minutes
setInterval(fetchEmails, 5 * 60 * 1000);
fetchEmails();

const axios = require("axios");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your API key in .env
});

const generate = async (mess) => {
  try {
    const prompt = `Analyze the following email and generate a professional reply:\n\n${mess}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use "gpt-3.5-turbo" for cheaper/faster results
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const generatedReply = completion.choices[0]?.message?.content;
    if (!generatedReply) throw new Error("No reply generated.");

    console.log("✅ Reply Generated:", generatedReply);
    return generatedReply;
  } catch (error) {
    console.error("❌ Error generating reply:", error.message || error);
    throw error;
  }
};
app.post("/reply", async (req, res) => {
  const { body } = req.body;


  console.log(body)
  console.log("come")
  if (!body) {
    return res.status(400).json({ error: "Missing email body" });
  }

  try {
    // 🔹 Send email body to Google Gemini API for analysis

    

    const generatedReply = await generate(body);


    console.log(generatedReply)
    // 🔹 Send reply email using Nodemailer
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
  port: 587,
  secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "soumyasis.st@gmail.com", // Replace with actual recipient
      subject: "Re: Your Email",
      text: generatedReply,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reply sent successfully!", reply: generatedReply });
  } catch (error) {
    console.error("❌ Error processing email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
