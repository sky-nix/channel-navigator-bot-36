
import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ChannelCard } from '@/components/channel-card';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { mockChannels } from '@/data/mock-data';
import { useNavigate } from 'react-router-dom';
import { Channel } from '@/types/channel';
import { CreateChannelForm } from '@/components/create-channel-form';

const Channels = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleCreateChannel = (channelData: { name: string; description: string; isActive: boolean }) => {
    const newChannel: Channel = {
      id: `channel${channels.length + 1}`,
      name: channelData.name,
      description: channelData.description,
      subscriberCount: 0,
      newSubscribers: 0,
      expiringSubscribers: 0,
      isActive: channelData.isActive,
      createdAt: new Date().toISOString(),
    };
    
    setChannels([...channels, newChannel]);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Channels</h1>
            <p className="text-muted-foreground mt-1">Manage your content channels</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Channel
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Channels Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onClick={() => navigate(`/channels/${channel.id}`)}
            />
          ))}
          
          {filteredChannels.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No channels found matching "{search}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                Create a new channel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <CreateChannelForm
            onClose={() => setShowCreateModal(false)}
            onCreateChannel={handleCreateChannel}
          />
        </div>
      )}
    </Layout>
  );
};

export default Channels;
