
import { Email, SearchQuery } from '@/types';
import { fetchEmails } from './emailService';

/**
 * Search emails based on provided query and filters
 */
export const searchEmails = async (searchQuery: SearchQuery): Promise<Email[]> => {
  // In a real app, this would call the search backend (Elasticsearch)
  // For now, we'll simulate by filtering the emails in memory
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all emails
  const allEmails = await fetchEmails();
  
  // If no query and no filters, return all emails
  if (!searchQuery.query && !searchQuery.filters) {
    return allEmails;
  }
  
  // Filter emails based on search query and filters
  return allEmails.filter(email => {
    let matches = true;
    
    // Text search
    if (searchQuery.query) {
      const query = searchQuery.query.toLowerCase();
      const matchesQuery = 
        email.subject.toLowerCase().includes(query) ||
        email.body.text.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query);
      
      if (!matchesQuery) {
        matches = false;
      }
    }
    
    // Filter by account
    if (matches && searchQuery.filters?.accounts?.length) {
      if (!searchQuery.filters.accounts.includes(email.account)) {
        matches = false;
      }
    }
    
    // Filter by labels
    if (matches && searchQuery.filters?.labels?.length) {
      const hasMatchingLabel = email.labels.some(label => 
        searchQuery.filters?.labels?.includes(label)
      );
      
      if (!hasMatchingLabel) {
        matches = false;
      }
    }
    
    // Filter by categories
    if (matches && searchQuery.filters?.categories?.length) {
      if (!email.category || !searchQuery.filters.categories.includes(email.category)) {
        matches = false;
      }
    }
    
    // Filter by read status
    if (matches && searchQuery.filters?.isRead !== undefined) {
      if (email.isRead !== searchQuery.filters.isRead) {
        matches = false;
      }
    }
    
    // Filter by starred status
    if (matches && searchQuery.filters?.isStarred !== undefined) {
      if (email.isStarred !== searchQuery.filters.isStarred) {
        matches = false;
      }
    }
    
    // Filter by attachments
    if (matches && searchQuery.filters?.hasAttachments) {
      if (email.attachments.length === 0) {
        matches = false;
      }
    }
    
    // Filter by date range
    if (matches && searchQuery.filters?.from) {
      if (email.date < searchQuery.filters.from) {
        matches = false;
      }
    }
    
    if (matches && searchQuery.filters?.to) {
      if (email.date > searchQuery.filters.to) {
        matches = false;
      }
    }
    
    return matches;
  });
};

/**
 * Get search suggestions based on a partial query
 */
export const getSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Sample suggestions
  const suggestions = [
    'from:john',
    'subject:meeting',
    'has:attachment',
    'label:work',
    'category:important',
    'is:unread',
    'is:starred',
  ];
  
  return suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(partialQuery.toLowerCase())
  );
};
