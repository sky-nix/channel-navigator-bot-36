
import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/user-card';
import { Search, Plus } from 'lucide-react';
import { mockUsers, mockChannels } from '@/data/mock-data';
import { User } from '@/types/user';
import { MessageBox } from '@/components/message-box';
import { CreateUserForm } from '@/components/create-user-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Subscribers = () => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  
  // Apply filters
  let filteredUsers = users;
  
  // Apply search filter
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }
  
  // Apply channel filter
  if (channelFilter !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.channelId === channelFilter);
  }
  
  const handleSendMessage = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleRemoveUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success(`${user.name} has been removed from channels`);
  };
  
  const handleAddUser = (userData: { name: string; username: string; expiresAt: Date }) => {
    // Default to first channel or use selected channel
    const channelId = channelFilter !== 'all' ? channelFilter : mockChannels[0].id;
    
    const newUser: User = {
      id: `user${Date.now()}`,
      name: userData.name,
      username: userData.username,
      channelId,
      joinedAt: new Date().toISOString(),
      expiresAt: userData.expiresAt.toISOString(),
      status: 'active',
    };
    
    setUsers([...users, newUser]);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Subscribers</h1>
            <p className="text-muted-foreground mt-1">Manage all your channel subscribers</p>
          </div>
          <Button 
            onClick={() => setShowAddUserForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subscribers..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:w-1/3">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {mockChannels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Subscribers Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onSendMessage={handleSendMessage}
              onRemoveUser={handleRemoveUser}
            />
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No subscribers found with current filters</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setChannelFilter('all');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
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
      
      {/* Add User Form */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <CreateUserForm
            onClose={() => setShowAddUserForm(false)}
            onCreateUser={handleAddUser}
          />
        </div>
      )}
    </Layout>
  );
};

export default Subscribers;
