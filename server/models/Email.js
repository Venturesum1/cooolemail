const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    sender: String,
    subject: String,
    body: String,
    receivedAt: Date,
    folder: String,
    category: { type: String, enum: ["Inbox", "Spam", "Out of Office"], default: "Inbox" }, // Default Inbox
    account: String
});

module.exports = mongoose.model("Email", EmailSchema);
