import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Webhook, Link2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NotificationSettings as NotificationSettingsType } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Custom Slack logo icon since lucide-react doesn't have one
const SlackLogo = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="h-5 w-5 text-primary"
  >
    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path>
    <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
    <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path>
    <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path>
    <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
    <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path>
    <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path>
    <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>
  </svg>
);

interface NotificationSettingsProps {
  isOpen: boolean;
  settings: NotificationSettingsType;
  onClose: () => void;
  onSave: (settings: NotificationSettingsType) => void;
}

const NotificationSettings = ({ isOpen, settings, onClose, onSave }: NotificationSettingsProps) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<NotificationSettingsType>(settings);
  
  const handleSave = () => {
    onSave(formState);
    toast({
      title: "Settings saved",
      description: "Your notification settings have been updated.",
    });
    onClose();
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
              <Bell className="h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified about emails
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Slack Integration */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SlackLogo />
                <h3 className="text-sm font-medium">Slack Notifications</h3>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-enabled">Enable Slack notifications</Label>
                  <Switch
                    id="slack-enabled"
                    checked={formState.slack?.enabled || false}
                    onCheckedChange={(checked) => 
                      setFormState({
                        ...formState,
                        slack: {
                          ...(formState.slack || { webhookUrl: '', notifyOn: { newEmail: true, importantEmail: true } }),
                          enabled: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-webhook" className="text-sm flex items-center">
                      Webhook URL
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Create an incoming webhook in your Slack workspace and paste the URL here.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="slack-webhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={formState.slack?.webhookUrl || ''}
                      onChange={(e) => 
                        setFormState({
                          ...formState,
                          slack: {
                            ...(formState.slack || { enabled: false, notifyOn: { newEmail: true, importantEmail: true } }),
                            webhookUrl: e.target.value
                          }
                        })
                      }
                      disabled={!formState.slack?.enabled}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={!formState.slack?.enabled}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Notify on</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="slack-new-email" 
                        className="text-sm font-normal"
                      >
                        New emails
                      </Label>
                      <Switch
                        id="slack-new-email"
                        checked={formState.slack?.notifyOn?.newEmail || false}
                        onCheckedChange={(checked) => 
                          setFormState({
                            ...formState,
                            slack: {
                              ...(formState.slack || { enabled: false, webhookUrl: '' }),
                              notifyOn: {
                                ...(formState.slack?.notifyOn || { importantEmail: true }),
                                newEmail: checked
                              }
                            }
                          })
                        }
                        disabled={!formState.slack?.enabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="slack-important-email"
                        className="text-sm font-normal"
                      >
                        Important emails only
                      </Label>
                      <Switch
                        id="slack-important-email"
                        checked={formState.slack?.notifyOn?.importantEmail || false}
                        onCheckedChange={(checked) => 
                          setFormState({
                            ...formState,
                            slack: {
                              ...(formState.slack || { enabled: false, webhookUrl: '' }),
                              notifyOn: {
                                ...(formState.slack?.notifyOn || { newEmail: true }),
                                importantEmail: checked
                              }
                            }
                          })
                        }
                        disabled={!formState.slack?.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Custom Webhook */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium">Custom Webhook</h3>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex items-center justify-between">
                  <Label htmlFor="webhook-enabled">Enable custom webhook</Label>
                  <Switch
                    id="webhook-enabled"
                    checked={formState.webhook?.enabled || false}
                    onCheckedChange={(checked) => 
                      setFormState({
                        ...formState,
                        webhook: {
                          ...(formState.webhook || { url: '', notifyOn: { newEmail: true, importantEmail: true } }),
                          enabled: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-sm">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-url"
                      placeholder="https://example.com/webhook"
                      value={formState.webhook?.url || ''}
                      onChange={(e) => 
                        setFormState({
                          ...formState,
                          webhook: {
                            ...(formState.webhook || { enabled: false, notifyOn: { newEmail: true, importantEmail: true } }),
                            url: e.target.value
                          }
                        })
                      }
                      disabled={!formState.webhook?.enabled}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={!formState.webhook?.enabled}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Notify on</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="webhook-new-email" 
                        className="text-sm font-normal"
                      >
                        New emails
                      </Label>
                      <Switch
                        id="webhook-new-email"
                        checked={formState.webhook?.notifyOn?.newEmail || false}
                        onCheckedChange={(checked) => 
                          setFormState({
                            ...formState,
                            webhook: {
                              ...(formState.webhook || { enabled: false, url: '' }),
                              notifyOn: {
                                ...(formState.webhook?.notifyOn || { importantEmail: true }),
                                newEmail: checked
                              }
                            }
                          })
                        }
                        disabled={!formState.webhook?.enabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="webhook-important-email"
                        className="text-sm font-normal"
                      >
                        Important emails only
                      </Label>
                      <Switch
                        id="webhook-important-email"
                        checked={formState.webhook?.notifyOn?.importantEmail || false}
                        onCheckedChange={(checked) => 
                          setFormState({
                            ...formState,
                            webhook: {
                              ...(formState.webhook || { enabled: false, url: '' }),
                              notifyOn: {
                                ...(formState.webhook?.notifyOn || { newEmail: true }),
                                importantEmail: checked
                              }
                            }
                          })
                        }
                        disabled={!formState.webhook?.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
