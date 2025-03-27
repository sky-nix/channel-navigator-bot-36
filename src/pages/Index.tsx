
import React from 'react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard-card';
import { ChannelCard } from '@/components/channel-card';
import { UserCard } from '@/components/user-card';
import { Users, LayoutDashboard, Clock, Activity, Plus } from 'lucide-react';
import { mockChannels, mockUsers, dashboardStats } from '@/data/mock-data';
import { useNavigate } from 'react-router-dom';
import { MessageBox } from '@/components/message-box';
import { User } from '@/types/user';
import { useState } from 'react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Get only active channels and sort by subscriber count
  const topChannels = [...mockChannels]
    .filter(channel => channel.isActive)
    .sort((a, b) => b.subscriberCount - a.subscriberCount)
    .slice(0, 3);
  
  // Get users that are expiring soon
  const expiringUsers = mockUsers
    .filter(user => user.status === 'expiring')
    .slice(0, 3);
  
  const handleSendMessage = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleRemoveUser = (user: User) => {
    toast.success(`${user.name} has been removed from the channel`);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your channels and subscribers</p>
          </div>
          <Button 
            onClick={() => navigate('/channels')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Channel
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Subscribers"
            value={dashboardStats.totalSubscribers.toLocaleString()}
            description="Across all channels"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Active Channels"
            value={dashboardStats.activeChannels}
            description={`Out of ${dashboardStats.totalChannels} total`}
            icon={<LayoutDashboard className="h-4 w-4" />}
          />
          <DashboardCard
            title="New This Week"
            value={dashboardStats.newSubscribersThisWeek}
            description="New subscribers"
            icon={<Activity className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Expiring Soon"
            value={dashboardStats.expiringSubscriptions}
            description="Within 7 days"
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>
        
        {/* Top Channels */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Top Channels</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={() => navigate(`/channels/${channel.id}`)}
              />
            ))}
          </div>
        </div>
        
        {/* Expiring Subscriptions */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Expiring Subscriptions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expiringUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onSendMessage={handleSendMessage}
                onRemoveUser={handleRemoveUser}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Message Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MessageBox
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
