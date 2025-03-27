
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateChannelFormProps {
  className?: string;
  onClose: () => void;
  onCreateChannel: (channelData: { name: string; description: string; isActive: boolean }) => void;
}

export function CreateChannelForm({ className, onClose, onCreateChannel }: CreateChannelFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Channel name is required');
      return;
    }
    
    onCreateChannel(formData);
    toast.success('Channel created successfully');
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
          <CardTitle className="text-xl">Create New Channel</CardTitle>
        </CardHeader>
        <CardContent className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Enter channel name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              name="description" 
              placeholder="Brief description of the channel"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="cursor-pointer">Channel Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Channel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
