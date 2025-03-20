
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bot, MessageSquare, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
import { AISettings as AISettingsType } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AISettingsProps {
  isOpen: boolean;
  settings: AISettingsType;
  onClose: () => void;
  onSave: (settings: AISettingsType) => void;
}

const AISettings = ({ isOpen, settings, onClose, onSave }: AISettingsProps) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<AISettingsType>(settings);
  
  const handleSave = () => {
    onSave(formState);
    toast({
      title: "Settings saved",
      description: "Your AI settings have been updated.",
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
              <Bot className="h-5 w-5 text-primary" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Configure how AI processes your emails
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-enabled" className="font-medium">AI Processing</Label>
                <Switch
                  id="ai-enabled"
                  checked={formState.enabled}
                  onCheckedChange={(checked) => setFormState({ ...formState, enabled: checked })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enable or disable all AI features
              </p>
            </div>
            
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium">Email Categorization</h3>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex items-center justify-between">
                  <Label htmlFor="categories-enabled">Auto-categorize emails</Label>
                  <Switch
                    id="categories-enabled"
                    checked={formState.categories.enabled}
                    onCheckedChange={(checked) => 
                      setFormState({
                        ...formState,
                        categories: { ...formState.categories, enabled: checked }
                      })
                    }
                    disabled={!formState.enabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="threshold" className="text-sm">Confidence threshold: {formState.categories.threshold}%</Label>
                  </div>
                  <Slider
                    id="threshold"
                    min={50}
                    max={95}
                    step={5}
                    value={[formState.categories.threshold]}
                    onValueChange={(value) => 
                      setFormState({
                        ...formState,
                        categories: { ...formState.categories, threshold: value[0] }
                      })
                    }
                    disabled={!formState.enabled || !formState.categories.enabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values require more confidence before categorizing
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium">Suggested Replies</h3>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex items-center justify-between">
                  <Label htmlFor="replies-enabled">Generate reply suggestions</Label>
                  <Switch
                    id="replies-enabled"
                    checked={formState.suggestedReplies.enabled}
                    onCheckedChange={(checked) => 
                      setFormState({
                        ...formState,
                        suggestedReplies: { ...formState.suggestedReplies, enabled: checked }
                      })
                    }
                    disabled={!formState.enabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reply-style" className="text-sm">Reply style</Label>
                  <Select
                    value={formState.suggestedReplies.style}
                    onValueChange={(value: 'professional' | 'friendly' | 'concise') => 
                      setFormState({
                        ...formState,
                        suggestedReplies: { ...formState.suggestedReplies, style: value }
                      })
                    }
                    disabled={!formState.enabled || !formState.suggestedReplies.enabled}
                  >
                    <SelectTrigger id="reply-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                    </SelectContent>
                  </Select>
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

export default AISettings;
