
import { Email } from '@/types';
import mockEmails from '@/data/mockEmails';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch emails from an account or all accounts
 */
export const fetchEmails = async (
  accountId?: string, 
  options: { limit?: number; offset?: number } = {}
): Promise<Email[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredEmails = accountId 
    ? mockEmails.filter(email => email.account === accountId)
    : mockEmails;
  
  // Sort by date (most recent first)
  filteredEmails = filteredEmails.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Apply pagination if needed
  if (options.limit) {
    const start = options.offset || 0;
    filteredEmails = filteredEmails.slice(start, start + options.limit);
  }
  
  return filteredEmails;
};

/**
 * Mark an email as read
 */
export const markAsRead = async (emailId: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const emailIndex = mockEmails.findIndex(email => email.id === emailId);
  if (emailIndex !== -1) {
    mockEmails[emailIndex].isRead = true;
  }
};

/**
 * Toggle star status for an email
 */
export const toggleStarred = async (emailId: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const emailIndex = mockEmails.findIndex(email => email.id === emailId);
  if (emailIndex !== -1) {
    mockEmails[emailIndex].isStarred = !mockEmails[emailIndex].isStarred;
  }
};

/**
 * Move an email to trash
 */
export const moveToTrash = async (emailId: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const emailIndex = mockEmails.findIndex(email => email.id === emailId);
  if (emailIndex !== -1) {
    mockEmails[emailIndex].isDeleted = true;
  }
};

/**
 * Get email by ID
 */
export const getEmailById = async (emailId: string): Promise<Email | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const email = mockEmails.find(email => email.id === emailId);
  return email || null;
};

/**
 * Send an email
 */
export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  body: string;
  attachments?: File[];
  from?: string;
}): Promise<Email> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('Email sent:', emailData);
  
  // Create a new email object for the sent email
  const newEmail: Email = {
    id: uuidv4(),
    account: 'account1', // Default to first account if not specified
    from: {
      name: 'You',
      email: emailData.from || 'user@example.com'
    },
    to: [
      {
        name: '',
        email: emailData.to
      }
    ],
    subject: emailData.subject,
    body: {
      text: emailData.body,
      html: `<p>${emailData.body.replace(/\n/g, '<br>')}</p>`
    },
    date: new Date(),
    isRead: true,
    isStarred: false,
    isDeleted: false,
    labels: ['sent'],
    attachments: emailData.attachments ? emailData.attachments.map(file => ({
      filename: file.name,
      contentType: file.type,
      size: file.size
    })) : [],
    category: 'neutral'
  };
  
  // Add to mock emails
  mockEmails.unshift(newEmail);
  
  return newEmail;
};
