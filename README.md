# Onebox Email Aggregator

Onebox is a feature-rich email aggregator designed to synchronize and manage multiple email accounts using IMAP in real-time. With built-in Elasticsearch for search, AI-powered email categorization, and Slack/webhook notifications, Onebox offers a seamless, efficient email management experience.

## Features
- **Unified Inbox:** Aggregate emails from multiple IMAP accounts.
- **Real-time Sync:** Keep emails updated using IMAP.
- **Advanced Search:** Elasticsearch-powered search for quick results.
- **AI Categorization:** Categorizes emails into relevant folders.
- **Slack Integration:** Receive notifications for important emails.
- **Webhooks Support:** Trigger external actions for specific email events.

---

## Environment Variables
Create a `.env` file and provide the following variables:

```env
OPENAI_API_KEY=
EMAIL_PASSWORD=
IMAP_HOST=imap.gmail.com
SMTP_HOST=smtp.gmail.com
MONGO_URI=
ELASTICSEARCH_URL=
ELASTICSEARCH_API_KEY=
SLACK_WEBHOOK_URL=
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
API_KEY=
```

> **Note:** Keep your `.env` file secure and avoid committing it to version control.

---

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd onebox
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Start the backend server:
    ```bash
    node index.js
    ```

---



## Usage
- View emails by navigating through different folders: **Inbox, Starred, Sent, Important, Spam, Trash**.
- Search emails using the Elasticsearch search bar.
- Receive real-time Slack notifications for new or categorized emails.
- Manage emails using AI-powered categorization.

---

## Contributing
Contributions are welcome! Please create an issue or submit a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For any questions or suggestions, feel free to reach out via Slack or email.

Happy coding! 🚀

