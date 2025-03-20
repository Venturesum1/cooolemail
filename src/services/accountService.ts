
import { EmailAccount } from '@/types';
import mockAccounts from '@/data/mockAccounts';

/**
 * Fetches all connected email accounts
 */
export const fetchAccounts = async (): Promise<EmailAccount[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAccounts;
};

/**
 * Adds a new email account
 */
export const addAccount = async (account: Partial<EmailAccount>): Promise<EmailAccount> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newAccount: EmailAccount = {
    id: `account${mockAccounts.length + 1}`,
    email: account.email || '',
    name: account.name || account.email || '',
    provider: account.provider || 'other',
    imapSettings: account.imapSettings || {
      host: '',
      port: 993,
      secure: true
    },
    lastSynced: new Date(),
    isConnected: true
  };
  
  mockAccounts.push(newAccount);
  return newAccount;
};
