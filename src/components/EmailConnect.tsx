
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Server, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface EmailConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (account: any) => void;
}

const EmailConnect = ({ isOpen, onClose, onConnect }: EmailConnectProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverDetails, setServerDetails] = useState({
    imapHost: '',
    imapPort: '993',
    useSSL: true,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getDefaultImapSettings = (provider: string) => {
    switch (provider) {
      case 'gmail':
        return { imapHost: 'imap.gmail.com', imapPort: '993', useSSL: true };
      case 'outlook':
        return { imapHost: 'outlook.office365.com', imapPort: '993', useSSL: true };
      case 'yahoo':
        return { imapHost: 'imap.mail.yahoo.com', imapPort: '993', useSSL: true };
      default:
        return { imapHost: '', imapPort: '993', useSSL: true };
    }
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    setServerDetails(getDefaultImapSettings(value));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create account object
      const account = {
        id: Date.now().toString(),
        email,
        provider,
        imapSettings: {
          host: serverDetails.imapHost,
          port: parseInt(serverDetails.imapPort),
          secure: serverDetails.useSSL,
        },
        lastSynced: new Date(),
        isConnected: true,
      };
      
      onConnect(account);
      
      toast({
        title: "Account connected",
        description: `${email} has been successfully connected.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect to email account. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-elevated">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Connect Email Account
            </CardTitle>
            <CardDescription>
              Connect your email account to sync messages
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleConnect}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Email Provider</Label>
                <Select
                  value={provider}
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                    <SelectItem value="yahoo">Yahoo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password or App Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {(provider === 'gmail' || provider === 'outlook') && (
                  <p className="text-xs text-muted-foreground mt-1">
                    For increased security, we recommend using an app password.
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
                <Label htmlFor="advanced">Show advanced settings</Label>
              </div>
              
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="imapHost">IMAP Server</Label>
                    <div className="flex items-center">
                      <Server className="w-4 h-4 mr-2 text-muted-foreground" />
                      <Input
                        id="imapHost"
                        placeholder="imap.example.com"
                        value={serverDetails.imapHost}
                        onChange={(e) => setServerDetails({ ...serverDetails, imapHost: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imapPort">Port</Label>
                      <Input
                        id="imapPort"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={serverDetails.imapPort}
                        onChange={(e) => setServerDetails({ ...serverDetails, imapPort: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ssl">Use SSL/TLS</Label>
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          id="ssl"
                          checked={serverDetails.useSSL}
                          onCheckedChange={(checked) => setServerDetails({ ...serverDetails, useSSL: checked })}
                        />
                        <Lock className={`w-4 h-4 ${serverDetails.useSSL ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Connecting
                  </>
                ) : 'Connect Account'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EmailConnect;
