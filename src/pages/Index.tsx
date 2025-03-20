import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailDetail from '@/components/EmailDetail';
import EmailConnect from '@/components/EmailConnect';
import EmailCompose from '@/components/EmailCompose'; 
import AISettings from '@/components/AISettings';
import NotificationSettings from '@/components/NotificationSettings';
import { 
  fetchEmails, 
  fetchAccounts, 
  addAccount,
  syncEmails,
  getUnreadCount,
  markAsRead,
  sendEmail
} from '@/services/emailService';
import { generateReply } from '@/services/aiService';
import { Email, EmailAccount, AISettings as AISettingsType, NotificationSettings as NotificationSettingsType } from '@/types';
import axios from 'axios';
const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // App state
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [accountUnreadCounts, setAccountUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [email, setEmail] = useState(null);
  const fetchData = async()=>{
    const category = "Inbox"
    try {
      const res = await axios.get(`https://cooolemail.onrender.com/api/emails/category/${category || "Inbox"}`)
      setEmail(res.data)
    } catch (error) {
      console.log("Error" + error)
    }
  }
  useEffect(() => {
    fetchData()
  }, []);
  // Settings
  const [aiSettings, setAiSettings] = useState<AISettingsType>({
    enabled: true,
    categories: {
      enabled: true,
      threshold: 75
    },
    suggestedReplies: {
      enabled: true,
      style: 'professional'
    }
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    slack: {
      webhookUrl: '',
      enabled: false,
      notifyOn: {
        newEmail: true,
        importantEmail: true
      }
    },
    webhook: {
      url: '',
      enabled: false,
      notifyOn: {
        newEmail: true,
        importantEmail: true
      }
    }
  });
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch accounts
        const fetchedAccounts = await fetchAccounts();
        setAccounts(fetchedAccounts);
        
        // Fetch emails
        const fetchedEmails = await fetchEmails();
        setEmails(fetchedEmails);
        
        // Get unread counts
        const total = await getUnreadCount();
        setUnreadCount(total);
        
        // Get unread counts per account
        const accountCounts: Record<string, number> = {};
        for (const account of fetchedAccounts) {
          accountCounts[account.id] = await getUnreadCount(account.id);
        }
        setAccountUnreadCounts(accountCounts);
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);
  
  // Handle email selection
  const handleSelectEmail = async (email: Email) => {
    if (!email.isRead) {
      // Mark as read in the UI immediately
      setEmails(prevEmails => 
        prevEmails.map(e => 
          e.id === email.id ? { ...e, isRead: true } : e
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update account unread count
      setAccountUnreadCounts(prev => ({
        ...prev,
        [email.account]: Math.max(0, (prev[email.account] || 0) - 1)
      }));
      
      // Mark as read in the backend
      await markAsRead(email.id);
    }
    
    // If the email has no suggested reply but AI is enabled, generate one
    if (!email.suggestedReply && aiSettings.enabled && aiSettings.suggestedReplies.enabled) {
      // Generate reply in the background
      try {
        const reply = await generateReply(email, aiSettings.suggestedReplies.style);
        
        setEmails(prevEmails => 
          prevEmails.map(e => 
            e.id === email.id ? { ...e, suggestedReply: reply } : e
          )
        );
        
        if (selectedEmail?.id === email.id) {
          setSelectedEmail(prev => prev ? { ...prev, suggestedReply: reply } : null);
        }
      } catch (error) {
        console.error('Error generating reply:', error);
      }
    }
    
    setSelectedEmail(email);
  };
  
  // Handle account selection
  const handleSelectAccount = async (accountId: string | null) => {
    setSelectedAccount(accountId);
    setSelectedEmail(null);
    setLoading(true);
    
    try {
      const fetchedEmails = await fetchEmails(accountId);
      setEmails(fetchedEmails);
    } catch (error) {
      console.error('Error fetching emails for account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load emails. Please try again.",
        });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle email sync
  const handleSync = async () => {
    try {
      toast({
        title: "Syncing emails",
        description: "Please wait while we sync your emails...",
      });
      
      const newEmailsCount = await syncEmails();
      
      // Refresh emails
      const fetchedEmails = await fetchEmails(selectedAccount);
      setEmails(fetchedEmails);
      
      // Update unread count
      const total = await getUnreadCount();
      setUnreadCount(total);
      
      // Update unread counts per account
      const accountCounts: Record<string, number> = {};
      for (const account of accounts) {
        accountCounts[account.id] = await getUnreadCount(account.id);
      }
      setAccountUnreadCounts(accountCounts);
      
      toast({
        title: "Sync complete",
        description: `${newEmailsCount} new emails received.`,
      });
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "Failed to sync emails. Please try again.",
      });
    }
  };
  
  // Handle account connection
  const handleConnectAccount = async (account: any) => {
    try {
      const newAccount = await addAccount(account);
      setAccounts(prev => [...prev, newAccount]);
      
      // Refresh emails
      const fetchedEmails = await fetchEmails();
      setEmails(fetchedEmails);
      
      toast({
        title: "Account connected",
        description: `${account.email} has been successfully connected.`,
      });
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect account. Please try again.",
      });
    }
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      // If search is cleared, reset to all emails
      handleSelectAccount(selectedAccount);
      return;
    }
    
    // Simple client-side search for demo
    const filteredEmails = emails.filter(email => 
      email.subject.toLowerCase().includes(query.toLowerCase()) || 
      email.body.text.toLowerCase().includes(query.toLowerCase()) ||
      email.from.name.toLowerCase().includes(query.toLowerCase()) ||
      email.from.email.toLowerCase().includes(query.toLowerCase())
    );
    
    setEmails(filteredEmails);
  };
  
  // Handle email reply
  const handleReply = (email: Email) => {
    setReplyToEmail(email);
    setComposeModalOpen(true);
  };

  // Handle send email
  const handleSendEmail = async (emailData: any) => {
    try {
      const fromAccount = accounts.find(acc => acc.id === (replyToEmail?.account || selectedAccount));
      
      const sentEmail = await sendEmail({
        ...emailData,
        from: fromAccount?.email || "user@example.com"
      });

      // Update the emails list to include the sent email
      setEmails(prev => [sentEmail, ...prev]);
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully.",
      });

      // Close reply modal
      setReplyToEmail(null);
      setComposeModalOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={handleSearch} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        unreadCount={unreadCount}
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => {
            console.log('Sidebar close button clicked');
            setSidebarOpen(false);
          }}
          onAddAccount={() => setConnectModalOpen(true)}
          onSync={handleSync}
          accounts={accounts.map(acc => ({
            id: acc.id,
            email: acc.email,
            unread: accountUnreadCounts[acc.id] || 0
          }))}
          selectedAccount={selectedAccount}
          onSelectAccount={handleSelectAccount}
        />
        
        <main className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} h-[calc(100vh-4rem)]`}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-muted-foreground">Loading emails...</p>
                </div>
              </motion.div>
            ) : (
              <>
                <section className={`${isMobile && selectedEmail ? 'hidden' : 'flex flex-col flex-none'} w-full md:w-2/5 border-r border-border overflow-hidden`}>
                  <EmailList 
                    emails={email} 
                    selectedEmail={selectedEmail}
                    onSelectEmail={handleSelectEmail}
                  />
                </section>
                
                <section className={`${isMobile && !selectedEmail ? 'hidden' : 'flex flex-col'} flex-1 overflow-hidden`}>
                  <EmailDetail 
                    email={selectedEmail}
                    onBack={() => setSelectedEmail(null)}
                    onReply={handleReply}
                  />
                </section>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Settings button group */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              <Button 
                size="icon" 
                className="bg-white shadow-subtle h-10 w-10"
                onClick={() => setNotificationSettingsOpen(true)}
              >
                <Bell className="h-5 w-5 text-primary" />
              </Button>
              
              <Button 
                size="icon" 
                className="bg-white shadow-subtle h-10 w-10"
                onClick={() => setAiSettingsOpen(true)}
              >
                <Bot className="h-5 w-5 text-primary" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          size="icon" 
          className="bg-primary shadow-subtle h-12 w-12"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Settings className="h-6 w-6 text-white" />
        </Button>
      </div>
      
      {/* Connect email modal */}
      <AnimatePresence>
        {connectModalOpen && (
          <EmailConnect
            isOpen={connectModalOpen}
            onClose={() => setConnectModalOpen(false)}
            onConnect={handleConnectAccount}
          />
        )}
      </AnimatePresence>
      
      {/* Email compose/reply modal */}
      <AnimatePresence>
        {composeModalOpen && (
          <EmailCompose
            isOpen={composeModalOpen}
            onClose={() => {
              setComposeModalOpen(false);
              setReplyToEmail(null);
            }}
            onSend={handleSendEmail}
            replyToEmail={replyToEmail || undefined}
          />
        )}
      </AnimatePresence>
      
      {/* AI settings modal */}
      <AnimatePresence>
        {aiSettingsOpen && (
          <AISettings
            isOpen={aiSettingsOpen}
            settings={aiSettings}
            onClose={() => setAiSettingsOpen(false)}
            onSave={setAiSettings}
          />
        )}
      </AnimatePresence>
      
      {/* Notification settings modal */}
      <AnimatePresence>
        {notificationSettingsOpen && (
          <NotificationSettings
            isOpen={notificationSettingsOpen}
            settings={notificationSettings}
            onClose={() => setNotificationSettingsOpen(false)}
            onSave={setNotificationSettings}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
