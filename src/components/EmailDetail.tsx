
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Reply,
  Forward,
  Trash2,
  Star,
  MoreHorizontal,
  ArrowLeft,
  Download,
  Paperclip,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Email } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';

interface EmailDetailProps {
  email: Email | null;
  onBack: () => void;
  onReply: (email: Email) => void;
}

const EmailDetail = ({ email, onBack, onReply }: EmailDetailProps) => {
  const isMobile = useIsMobile();
  const [showSuggestedReply, setShowSuggestedReply] = useState(false);
 
  // Reset and then show suggested reply when email changes
  useEffect(() => {
    setShowSuggestedReply(false);
    
    if (email?.suggestedReply) {
      const timer = setTimeout(() => {
        setShowSuggestedReply(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [email]);
  
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'interested': return 'bg-category-interested text-white';
      case 'spam': return 'bg-category-spam text-white';
      case 'important': return 'bg-category-important text-white';
      default: return 'bg-category-neutral text-white';
    }
  };
  
  const getCategoryName = (category?: string) => {
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Neutral';
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
  const handleUseSuggestedReply = () => {
    if (email) {
      onReply(email);
    }
  };

  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center"
        >
          <Clock className="h-8 w-8 text-muted-foreground" />
        </motion.div>
        <h3 className="text-lg font-medium mb-2">No email selected</h3>
        <p className="text-muted-foreground max-w-sm">
          Select an email from the list to view its contents.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-border p-4"
      >
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <h2 className="text-lg font-medium truncate">
          {email.subject}
        </h2>
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                 
                </Button>
              </TooltipTrigger>
              <TooltipContent>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
      
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                <span className="font-semibold text-sm">
                  {email.sender ? email.sender.charAt(0).toUpperCase() : email.sender.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="font-semibold">
                    {email.sender}
                  </h3>
                  
                  <span className="text-sm text-muted-foreground">
                    &lt;{email.sender}&gt;
                  </span>
                  
                  {email.category && (
                    <Badge 
                      className={cn("ml-2 text-xs", getCategoryColor(email.category))}
                    >
                      {getCategoryName(email.category)}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {/* To: {email.to.map(recipient => recipient.name || recipient.email).join(', ')} */}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
              {formatDate(email.date)}
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none mb-8">
            {email.body &&
              
              <p>{email.body}</p>
}
          </div>
          
         
        </motion.div>
      </div>
      
      <div className="border-t border-border p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => handleReply(email)}
          >
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
        
        <AnimatePresence>
          {showSuggestedReply && email?.suggestedReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                AI Suggested Reply
              </h4>
              
              <div className="bg-secondary/50 rounded-md p-3 text-sm border border-border">
                <p>{email.suggestedReply}</p>
              </div>
              
              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="secondary" onClick={handleUseSuggestedReply}>
                  Use this reply
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailDetail;
