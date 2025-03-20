import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  Star,
  Send,
  Trash2,
  Tag,
  Settings,
  Mail,
  AlertCircle,
  ArchiveX,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: () => void;
  onSync: () => void;
  accounts: { id: string; email: string; unread: number }[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string | null) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  onAddAccount,
  onSync,
  accounts,
  selectedAccount,
  onSelectAccount,
}: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isSyncing, setIsSyncing] = useState(false);

  const sidebarVariants = {
    hidden: { x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: isMobile ? -300 : 0, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const handleSync = () => {
    setIsSyncing(true);
    onSync();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const navItems = [
    { icon: Inbox, label: 'Inbox', count: 12 },
    { icon: Star, label: 'Starred', count: 3 },
    { icon: Send, label: 'Sent', count: 0 },
    { icon: AlertCircle, label: 'Important', count: 5 },
    { icon: ArchiveX, label: 'Spam', count: 8 },
    { icon: Trash2, label: 'Trash', count: 0 },
  ];

  const categories = [
    { label: 'Interested', color: 'bg-category-interested', count: 7 },
    { label: 'Important', color: 'bg-category-important', count: 4 },
    { label: 'Neutral', color: 'bg-category-neutral', count: 15 },
    { label: 'Spam', color: 'bg-category-spam', count: 3 },
  ];

  return (
    <>
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 left-0 h-full z-50 w-64 bg-white dark:bg-slate-950 shadow-subtle flex flex-col border-r border-border',
              !isMobile && 'relative'
            )}
          >
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
              <h1 className="text-lg font-semibold text-foreground">Onebox</h1>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Folders</h2>
              {navItems.map((item) => (
                <Button key={item.label} variant="ghost" size="sm" className="w-full justify-start">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.count > 0 && <Badge variant="outline" className="ml-auto">{item.count}</Badge>}
                </Button>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Close Sidebar
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;