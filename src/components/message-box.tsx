
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import { toast } from 'sonner';

interface MessageBoxProps {
  user: User;
  className?: string;
  onClose: () => void;
}

export function MessageBox({ user, className, onClose }: MessageBoxProps) {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // Here you would send the message
    toast.success(`Message sent to ${user.name}`);
    setMessage('');
    onClose();
  };
  
  return (
    <Card 
      className={cn(
        'overflow-hidden border border-border/50 w-full max-w-sm',
        'animate-scale',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex gap-3 items-center">
          <Avatar className="h-9 w-9">
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-base">Message {user.name}</CardTitle>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <Textarea
          placeholder="Type your message here..."
          className="resize-none h-24"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0 pb-3">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSendMessage}>
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
}
