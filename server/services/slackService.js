const { WebClient } = require("@slack/web-api");
const Email = require("../models/Email");

const slack = new WebClient(process.env.SLACK_TOKEN);

const sendSlackNotification = async () => {
    const interestedEmails = await Email.find({ category: "Interested" });

    for (let email of interestedEmails) {
        await slack.chat.postMessage({
            channel: process.env.SLACK_CHANNEL,
            text: `New Interested Email: ${email.subject} from ${email.sender}`
        });
    }
};

module.exports = { sendSlackNotification };
