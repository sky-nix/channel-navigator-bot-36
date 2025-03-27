
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CreateUserFormProps {
  className?: string;
  onClose: () => void;
  onCreateUser: (userData: { 
    name: string; 
    username: string; 
    expiresAt: Date;
  }) => void;
}

export function CreateUserForm({ className, onClose, onCreateUser }: CreateUserFormProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days from now
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !username.trim() || !expiresAt) {
      toast.error('All fields are required');
      return;
    }
    
    onCreateUser({
      name,
      username,
      expiresAt,
    });
    
    toast.success('User added successfully');
    onClose();
  };
  
  return (
    <Card 
      className={cn(
        'overflow-hidden border border-border/50 w-full max-w-md animate-scale',
        className
      )}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Add New Subscriber</CardTitle>
        </CardHeader>
        <CardContent className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Subscription Expiration</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? format(expiresAt, "PPP") : "Select expiration date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={setExpiresAt}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Subscriber
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
