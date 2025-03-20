
import { EmailAccount } from '@/types';

// Simulated account data for demo
const mockAccounts: EmailAccount[] = [
  {
    id: 'account1',
    email: 'user@gmail.com',
    name: 'Work Email',
    provider: 'gmail',
    imapSettings: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    },
    lastSynced: new Date(),
    isConnected: true
  },
  {
    id: 'account2',
    email: 'personal@outlook.com',
    name: 'Personal Email',
    provider: 'outlook',
    imapSettings: {
      host: 'outlook.office365.com',
      port: 993,
      secure: true
    },
    lastSynced: new Date(),
    isConnected: true
  }
];

export default mockAccounts;
