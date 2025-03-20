
import { Email } from '@/types';

// Simulated email data for demo
const mockEmails: Email[] = [
  {
    id: '1',
    account: 'account1',
    from: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'Meeting Tomorrow',
    body: {
      text: 'Hi, I wanted to confirm our meeting tomorrow at 2 PM. Please let me know if that still works for you.',
      html: '<p>Hi,</p><p>I wanted to confirm our meeting tomorrow at 2 PM. Please let me know if that still works for you.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    isStarred: true,
    isDeleted: false,
    labels: ['work', 'meeting'],
    attachments: [],
    category: 'important',
    suggestedReply: 'Hi John, yes, the meeting tomorrow at 2 PM works for me. Looking forward to it.'
  },
  {
    id: '2',
    account: 'account1',
    from: {
      name: 'Amazon',
      email: 'orders@amazon.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'Your Amazon Order #123-4567890-1234567',
    body: {
      text: 'Thank you for your order. Your package has been shipped and will arrive on Friday.',
      html: '<p>Thank you for your order. Your package has been shipped and will arrive on Friday.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    isStarred: false,
    isDeleted: false,
    labels: ['shopping'],
    attachments: [
      {
        filename: 'receipt.pdf',
        contentType: 'application/pdf',
        size: 152000
      }
    ],
    category: 'interested'
  },
  {
    id: '3',
    account: 'account2',
    from: {
      name: 'LinkedIn',
      email: 'notifications@linkedin.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'You have 5 new notifications',
    body: {
      text: 'You have 5 new notifications on LinkedIn. See who viewed your profile.',
      html: '<p>You have 5 new notifications on LinkedIn. See who viewed your profile.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    isStarred: false,
    isDeleted: false,
    labels: ['social'],
    attachments: [],
    category: 'neutral'
  },
  {
    id: '4',
    account: 'account1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'Project Update: Q3 Marketing Campaign',
    body: {
      text: 'Hi team, I\'ve attached the latest designs for the Q3 marketing campaign. Please review and provide feedback by Wednesday.',
      html: '<p>Hi team,</p><p>I\'ve attached the latest designs for the Q3 marketing campaign. Please review and provide feedback by Wednesday.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: false,
    isStarred: true,
    isDeleted: false,
    labels: ['work', 'important'],
    attachments: [
      {
        filename: 'Q3_Marketing_Designs.pdf',
        contentType: 'application/pdf',
        size: 3450000
      },
      {
        filename: 'Brand_Guidelines.pdf',
        contentType: 'application/pdf',
        size: 2150000
      }
    ],
    category: 'important',
    suggestedReply: 'Hi Sarah, thanks for sharing the designs. I\'ll review them and provide feedback by Wednesday as requested.'
  },
  {
    id: '5',
    account: 'account2',
    from: {
      name: 'Netflix',
      email: 'info@netflix.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'New on Netflix: Recommended for You',
    body: {
      text: 'Check out the latest shows and movies added to Netflix this week, personalized based on your viewing history.',
      html: '<p>Check out the latest shows and movies added to Netflix this week, personalized based on your viewing history.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    isRead: true,
    isStarred: false,
    isDeleted: false,
    labels: ['entertainment'],
    attachments: [],
    category: 'neutral'
  },
  {
    id: '6',
    account: 'account1',
    from: {
      name: 'Unknown Sender',
      email: 'suspicious@example.com'
    },
    to: [
      {
        name: 'Current User',
        email: 'user@example.com'
      }
    ],
    subject: 'URGENT: Your Account Has Been Compromised',
    body: {
      text: 'We have detected unusual activity with your account. Click here immediately to verify your identity and secure your account.',
      html: '<p>We have detected unusual activity with your account. Click here immediately to verify your identity and secure your account.</p>'
    },
    date: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    isRead: true,
    isStarred: false,
    isDeleted: false,
    labels: [],
    attachments: [],
    category: 'spam'
  }
];

export default mockEmails;
