import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip, Star, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Email } from '@/types';
import axios from 'axios';

interface EmailListProps {
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

const EmailList = ({ selectedEmail, onSelectEmail }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const category = "Inbox";
        const response = await axios.get(`https://cooolemail.onrender.com/api/emails/category/${category || "Inbox"}`)
        console.log(response.data)
        setEmails(response.data || []);
      } catch (err) {
        setError('Failed to load emails.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const emailDate = new Date(date);

    if (emailDate.toDateString() === now.toDateString()) {
      return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (now.getTime() - emailDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return emailDate.toLocaleDateString([], { weekday: 'short' });
    }
    if (emailDate.getFullYear() === now.getFullYear()) {
      return emailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return emailDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'interested': return 'bg-category-interested';
      case 'spam': return 'bg-category-spam';
      case 'important': return 'bg-category-important';
      default: return 'bg-category-neutral';
    }
  };
  const handleReply = async (email: Email) => {
    try {
      const response = await axios.post("https://cooolemail.onrender.com/reply", { body: email.body });
      alert("Reply Sent: " + response.data.message);
    } catch (error) {
      console.error("❌ Error sending reply:", error);
      alert("Failed to send reply");
    }
  };
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading emails...</div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {emails.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center"
          >
            <Clock className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">No emails yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Connect your email accounts to start syncing your messages.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-border"
            >
             {emails.map((email, index) => (
  <motion.div
    key={email?._id || index}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    className={cn(
      "group relative px-4 py-3 transition-colors cursor-pointer",
      selectedEmail?._id === email?._id ? "bg-primary/5" : "hover:bg-secondary/50",
      !email?.isRead && "bg-secondary/30"
    )}
    onMouseEnter={() => setHoveredId(email?._id)}
    onMouseLeave={() => setHoveredId(null)}
    onClick={() => onSelectEmail(email)}
  >
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Star
          className={cn(
            "h-4 w-4",
            email?.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
          )}
        />
      </Button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "font-medium truncate",
            email?.isRead ? "text-foreground" : "text-foreground font-semibold"
          )}>
            {email?.sender || 'Unknown Sender'}
          </span>
          <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
            {formatDate(email?.receivedAt ? new Date(email.receivedAt) : new Date())}
          </span>
        </div>

        <h4 className={cn(
          "text-sm mb-1 truncate",
          email?.isRead ? "font-normal" : "font-medium"
        )}>
          {email?.subject || 'No Subject'}
        </h4>

        <div className="flex items-center text-xs text-muted-foreground">
          <p className="truncate">{email?.body?.substring(0, 100) || 'No Content'}</p>

          {email?.attachments?.length > 0 && (
            <span className="ml-2 flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              {email.attachments.length}
            </span>
          )}
        </div>
      </div>

      <ChevronRight 
        className={cn(
          "h-4 w-4 transition-opacity",
          hoveredId === email?._id || selectedEmail?._id === email?._id 
            ? "opacity-100" 
            : "opacity-0"
        )} 
      />
    </div>

    {!email?.isRead && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
    )}
  </motion.div>
))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EmailList;
