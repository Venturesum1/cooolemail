
import mockEmails from '@/data/mockEmails';

/**
 * Sync emails from all connected accounts
 */
export const syncEmails = async (): Promise<number> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return number of new emails
  return Math.floor(Math.random() * 5);
};

/**
 * Get unread count for an account
 */
export const getUnreadCount = async (accountId?: string): Promise<number> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (accountId) {
    return mockEmails.filter(email => email.account === accountId && !email.isRead).length;
  }
  
  return mockEmails.filter(email => !email.isRead).length;
};
