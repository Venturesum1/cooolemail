const OpenAI = require("openai");
const Email = require("../models/Email");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const categorizeEmail = async (email) => {
    const prompt = `Categorize the following email into: Interested, Meeting Booked, Not Interested, Spam, Out of Office.\n\nSubject: ${email.subject}\n\nBody: ${email.body}\n\nCategory:`;

    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 5
    });

    return response.data.choices[0].text.trim();
};

const updateEmailCategory = async () => {
    const emails = await Email.find({ category: "Uncategorized" });

    for (let email of emails) {
        email.category = await categorizeEmail(email);
        await email.save();
    }

    console.log("AI Categorization Complete");
};

module.exports = { updateEmailCategory };
