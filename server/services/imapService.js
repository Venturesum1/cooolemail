const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const Email = require("../models/Email");

const imapConfig = {
    user: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_HOST,
    port: 993,  // Secure IMAP Port
    tls: true,  // Enable TLS
    tlsOptions: {
      rejectUnauthorized: false, // Allow self-signed certificates
    }
  };
  

const fetchEmails = async () => {
    try {
        const connection = await imaps.connect({ imap: imapConfig });
        await connection.openBox("INBOX");

        const searchCriteria = ["ALL"];
        const fetchOptions = { bodies: ["HEADER", "TEXT"], struct: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        for (let message of messages) {
            const { text } = await simpleParser(message.parts.find(part => part.which === "TEXT").body);

            await Email.create({
                sender: message.attributes.from,
                subject: message.parts[0].body.subject,
                body: text,
                receivedAt: message.attributes.date,
                folder: "INBOX",
                category: "Uncategorized"
            });
        }

        console.log("Emails fetched and stored");
    } catch (error) {
        console.error("IMAP Fetch Error:", error);
    }
};

module.exports = { fetchEmails };
