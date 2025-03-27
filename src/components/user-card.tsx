
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  className?: string;
  onSendMessage?: (user: User) => void;
  onRemoveUser?: (user: User) => void;
}

export function UserCard({ user, className, onSendMessage, onRemoveUser }: UserCardProps) {
  const joinedDate = new Date(user.joinedAt);
  const expirationDate = new Date(user.expiresAt);
  const timeLeft = formatDistanceToNow(expirationDate, { addSuffix: true });
  const isExpiringSoon = expirationDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
  
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 border border-border/50',
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
            <CardTitle className="text-base flex items-center gap-2">
              {user.name}
              {isExpiringSoon && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="text-xs px-1 py-0 h-5">Expiring Soon</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This subscription is ending {timeLeft}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Expires {timeLeft}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 pt-1 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs gap-1.5"
          onClick={() => onSendMessage?.(user)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Message
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full text-xs"
          onClick={() => onRemoveUser?.(user)}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
