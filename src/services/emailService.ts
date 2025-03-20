
import { Email, EmailAccount } from '@/types';

// Re-export from all service modules
export { fetchAccounts, addAccount } from './accountService';
export { 
  fetchEmails, 
  markAsRead, 
  toggleStarred, 
  moveToTrash, 
  getEmailById,
  sendEmail 
} from './emailOperations';
export { syncEmails, getUnreadCount } from './syncService';
