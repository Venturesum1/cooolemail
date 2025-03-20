
import { useState, useEffect } from 'react';
import { Search, Settings, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
  unreadCount: number;
}

const Header = ({ onSearch, onToggleSidebar, unreadCount }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-200",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-subtle" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">
                <span className="font-semibold text-sm">OB</span>
              </div>
            </motion.div>
            
            {!isMobile && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg font-semibold text-foreground"
              >
                Onebox
              </motion.h1>
            )}
          </div>
        </div>
        
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative w-full max-w-md mx-4"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            className="pl-10 bg-secondary/50 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.form>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
                    <span className="text-[10px]">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <span>Notification settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="ml-1">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
