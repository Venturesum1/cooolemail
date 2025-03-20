
import { NotificationSettings, Email } from '@/types';

/**
 * Send a notification to Slack
 */
export const sendSlackNotification = async (
  webhookUrl: string,
  email: Email
): Promise<boolean> => {
  // In a real app, this would call the Slack API
  // For now, we'll just simulate success
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Log the call for demo purposes
  console.log(`Sending Slack notification to ${webhookUrl} for email: ${email.subject}`);
  
  // Slack message payload would look something like this
  const payload = {
    text: `New email from ${email.from.name} <${email.from.email}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New email received*\n*From:* ${email.from.name} <${email.from.email}>\n*Subject:* ${email.subject}`
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: email.body.text.substring(0, 100) + (email.body.text.length > 100 ? "..." : "")
        }
      }
    ]
  };
  
  // Return success for demo
  return true;
};

/**
 * Send a notification to a custom webhook
 */
export const sendWebhookNotification = async (
  webhookUrl: string,
  email: Email
): Promise<boolean> => {
  // In a real app, this would call the webhook URL
  // For now, we'll just simulate success
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Log the call for demo purposes
  console.log(`Sending webhook notification to ${webhookUrl} for email: ${email.subject}`);
  
  // Webhook payload would look something like this
  const payload = {
    event: "new_email",
    data: {
      id: email.id,
      from: email.from,
      subject: email.subject,
      received_at: email.date.toISOString(),
      is_read: email.isRead,
      category: email.category
    }
  };
  
  // Return success for demo
  return true;
};

/**
 * Process a new email and send notifications based on settings
 */
export const processEmailNotifications = async (
  email: Email,
  settings: NotificationSettings
): Promise<void> => {
  // Skip if no notifications are enabled
  if ((!settings.slack?.enabled && !settings.webhook?.enabled) || 
      email.isRead) {
    return;
  }
  
  // Process Slack notifications
  if (settings.slack?.enabled && settings.slack.webhookUrl) {
    // Check notification conditions
    const shouldNotify = 
      (settings.slack.notifyOn.newEmail) || 
      (settings.slack.notifyOn.importantEmail && email.category === 'important');
    
    if (shouldNotify) {
      await sendSlackNotification(settings.slack.webhookUrl, email);
    }
  }
  
  // Process webhook notifications
  if (settings.webhook?.enabled && settings.webhook.url) {
    // Check notification conditions
    const shouldNotify = 
      (settings.webhook.notifyOn.newEmail) ||
      (settings.webhook.notifyOn.importantEmail && email.category === 'important');
    
    if (shouldNotify) {
      await sendWebhookNotification(settings.webhook.url, email);
    }
  }
};

/**
 * Test notification settings
 */
export const testNotificationSettings = async (
  settings: NotificationSettings
): Promise<{ slack: boolean; webhook: boolean }> => {
  // Simulate API calls
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create test email
  const testEmail: Email = {
    id: 'test-email',
    account: 'test-account',
    from: {
      name: 'Test Sender',
      email: 'test@example.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'Test Notification',
    body: {
      text: 'This is a test notification to verify your notification settings.',
      html: '<p>This is a test notification to verify your notification settings.</p>'
    },
    date: new Date(),
    isRead: false,
    isStarred: false,
    isDeleted: false,
    labels: ['test'],
    attachments: [],
    category: 'important'
  };
  
  let slackResult = false;
  let webhookResult = false;
  
  if (settings.slack?.enabled && settings.slack.webhookUrl) {
    slackResult = await sendSlackNotification(settings.slack.webhookUrl, testEmail);
  }
  
  if (settings.webhook?.enabled && settings.webhook.url) {
    webhookResult = await sendWebhookNotification(settings.webhook.url, testEmail);
  }
  
  return { slack: slackResult, webhook: webhookResult };
};
