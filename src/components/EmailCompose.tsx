
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Email } from '@/types';

interface EmailComposeProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: any) => void;
  replyToEmail?: Email;
}

const EmailCompose = ({ isOpen, onClose, onSend, replyToEmail }: EmailComposeProps) => {
  const { toast } = useToast();
  const [to, setTo] = useState(replyToEmail ? replyToEmail.from.email : '');
  const [subject, setSubject] = useState(replyToEmail ? `Re: ${replyToEmail.subject}` : '');
  const [body, setBody] = useState(
    replyToEmail 
      ? `\n\n---\nOn ${new Date(replyToEmail.date).toLocaleString()}, ${replyToEmail.from.name} <${replyToEmail.from.email}> wrote:\n\n${replyToEmail.body.text}`
      : ''
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!to) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please specify at least one recipient.",
      });
      return;
    }

    if (!subject) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add a subject.",
      });
      return;
    }

    if (!body) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add a message body.",
      });
      return;
    }

    setSending(true);

    try {
      await onSend({
        to,
        subject,
        body,
        attachments
      });
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-lg w-full max-w-3xl shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-medium">
            {replyToEmail ? 'Reply' : 'New Email'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium mb-1">To:</label>
            <Input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject:</label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium mb-1">Message:</label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[200px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Attachments:</label>
            {attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-sm truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium cursor-pointer hover:bg-muted"
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Add attachment
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleAddAttachment}
                multiple
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-border p-4 flex justify-end">
          <Button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center"
          >
            {sending ? 'Sending...' : 'Send'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailCompose;
