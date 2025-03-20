
import { Email } from '@/types';

/**
 * Categorize an email using AI
 */
export const categorizeEmail = async (email: Email): Promise<string> => {
  // In a real app, this would call an AI service
  // For now, we'll simulate with random results
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const categories = ['interested', 'spam', 'important', 'neutral'];
  
  // For demo purposes, we'll categorize based on some simple rules
  if (email.subject.toLowerCase().includes('urgent') || 
      email.subject.toLowerCase().includes('verify') ||
      email.subject.toLowerCase().includes('account')) {
    return 'spam';
  }
  
  if (email.labels.includes('work') || 
      email.labels.includes('important') ||
      email.subject.toLowerCase().includes('project')) {
    return 'important';
  }
  
  if (email.from.email.includes('amazon') ||
      email.from.email.includes('order') ||
      email.subject.toLowerCase().includes('order')) {
    return 'interested';
  }
  
  return 'neutral';
};

/**
 * Generate a suggested reply for an email
 */
export const generateReply = async (email: Email, style: string = 'professional'): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll have a few template replies
  const templates = {
    meeting: [
      "Thanks for the meeting invite. I've added it to my calendar and look forward to our discussion.",
      "I confirm that I'll attend the meeting. Looking forward to it.",
      "The meeting time works for me. I'll be there."
    ],
    order: [
      "Thank you for the order confirmation. I appreciate the update.",
      "Thanks for letting me know about my order status.",
      "Appreciate the order details. Looking forward to receiving it."
    ],
    update: [
      "Thanks for sending the update. I'll review it and provide feedback soon.",
      "I've received your update and will take a look at it shortly.",
      "Appreciate you sharing this update. I'll go through it carefully."
    ],
    general: [
      "Thank you for your email. I'll look into this and respond soon.",
      "I've received your message and will get back to you shortly.",
      "Thanks for reaching out. I'll consider your message and reply when I can."
    ]
  };
  
  let category = 'general';
  
  if (email.subject.toLowerCase().includes('meeting') || 
      email.body.text.toLowerCase().includes('meeting')) {
    category = 'meeting';
  } else if (email.subject.toLowerCase().includes('order') || 
            email.from.email.includes('amazon')) {
    category = 'order';
  } else if (email.subject.toLowerCase().includes('update') || 
            email.body.text.toLowerCase().includes('update')) {
    category = 'update';
  }
  
  const possibleReplies = templates[category as keyof typeof templates];
  
  // Choose a random reply from the category
  const randomIndex = Math.floor(Math.random() * possibleReplies.length);
  
  // Apply style modifications
  let reply = possibleReplies[randomIndex];
  
  if (style === 'friendly') {
    reply = `Hi ${email.from.name.split(' ')[0]}, \n\n${reply} 😊\n\nBest,\n[Your Name]`;
  } else if (style === 'professional') {
    reply = `Dear ${email.from.name}, \n\n${reply}\n\nBest regards,\n[Your Name]`;
  } else if (style === 'concise') {
    reply = reply.replace(/I'll |I've |I |Looking forward to |Appreciate /, '');
    reply = `${reply}\n\nRegards,\n[Your Name]`;
  }
  
  console.log("Generated reply:", reply);
  return reply;
};

/**
 * Analyze email sentiment
 */
export const analyzeSentiment = async (emailContent: string): Promise<{ sentiment: string; score: number }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Simple keyword-based sentiment analysis for demo
  const positiveWords = ['thank', 'appreciate', 'good', 'great', 'excellent', 'happy', 'pleased'];
  const negativeWords = ['urgent', 'issue', 'problem', 'concerned', 'disappointed', 'unhappy', 'error'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  const content = emailContent.toLowerCase();
  
  positiveWords.forEach(word => {
    if (content.includes(word)) {
      positiveScore += 1;
    }
  });
  
  negativeWords.forEach(word => {
    if (content.includes(word)) {
      negativeScore += 1;
    }
  });
  
  const totalScore = positiveScore - negativeScore;
  let sentiment;
  
  if (totalScore > 1) {
    sentiment = 'positive';
  } else if (totalScore < -1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  return { sentiment, score: totalScore };
};
