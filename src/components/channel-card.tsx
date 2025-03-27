
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Channel } from '@/types/channel';

interface ChannelCardProps {
  channel: Channel;
  className?: string;
  onClick?: () => void;
}

export function ChannelCard({ channel, className, onClick }: ChannelCardProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]',
        'cursor-pointer border border-border/50',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium">
                {channel.name.substring(0, 2).toUpperCase()}
              </div>
            </Avatar>
            <div>
              <CardTitle className="text-base">{channel.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {channel.subscriberCount.toLocaleString()} subscribers
              </CardDescription>
            </div>
          </div>
          <Badge variant={channel.isActive ? "default" : "outline"} className="ml-auto">
            {channel.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{channel.newSubscribers}</span>
            <span className="text-xs">new this week</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-foreground">{channel.expiringSubscribers}</span>
            <span className="text-xs">expiring soon</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button variant="outline" size="sm" className="w-full">
          Manage Channel
        </Button>
      </CardFooter>
    </Card>
  );
}
