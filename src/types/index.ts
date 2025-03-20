
export interface Email {
  private _id(_id: any): void;
  id: string;
  account: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: {
    text: string;
    html: string;
  };
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  isDeleted: boolean;
  labels: string[];
  attachments: Attachment[];
  category?: 'interested' | 'spam' | 'important' | 'neutral';
  suggestedReply?: string;
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  content?: Blob; // Base64 encoded content
  downloadUrl?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: string;
  imapSettings: {
    host: string;
    port: number;
    secure: boolean;
  };
  lastSynced?: Date;
  isConnected: boolean;
}

export interface SearchQuery {
  query: string;
  filters?: {
    accounts?: string[];
    labels?: string[];
    categories?: string[];
    isRead?: boolean;
    isStarred?: boolean;
    hasAttachments?: boolean;
    from?: Date;
    to?: Date;
  };
}

export interface NotificationSettings {
  slack?: {
    webhookUrl: string;
    enabled: boolean;
    notifyOn: {
      newEmail: boolean;
      importantEmail: boolean;
    };
  };
  webhook?: {
    url: string;
    enabled: boolean;
    notifyOn: {
      newEmail: boolean;
      importantEmail: boolean;
    };
  };
}

export interface AISettings {
  enabled: boolean;
  categories: {
    enabled: boolean;
    threshold: number;
  };
  suggestedReplies: {
    enabled: boolean;
    style: 'professional' | 'friendly' | 'concise';
  };
}
