
import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UserCard } from '@/components/user-card';
import { useParams, useNavigate } from 'react-router-dom';
import { mockChannels, mockUsers } from '@/data/mock-data';
import { ArrowLeft, Plus, Search, Users, Settings, BarChart } from 'lucide-react';
import { Channel } from '@/types/channel';
import { User } from '@/types/user';
import { MessageBox } from '@/components/message-box';
import { CreateUserForm } from '@/components/create-user-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const ChannelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const channel = mockChannels.find(c => c.id === id);
  const channelUsers = mockUsers.filter(user => user.channelId === id);
  
  const [search, setSearch] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(channelUsers);
  
  if (!channel) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium">Channel not found</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/channels')}>
            Back to Channels
          </Button>
        </div>
      </Layout>
    );
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSendMessage = (user: User) => {
    setSelectedUser(user);
    setShowMessageBox(true);
  };
  
  const handleRemoveUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success(`${user.name} has been removed from the channel`);
  };
  
  const handleAddUser = (userData: { name: string; username: string; expiresAt: Date }) => {
    const newUser: User = {
      id: `user${Date.now()}`,
      name: userData.name,
      username: userData.username,
      channelId: channel.id,
      joinedAt: new Date().toISOString(),
      expiresAt: userData.expiresAt.toISOString(),
      status: 'active',
    };
    
    setUsers([...users, newUser]);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/channels')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{channel.name}</h1>
                <Badge variant={channel.isActive ? "default" : "outline"}>
                  {channel.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Created {format(new Date(channel.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddUserForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
        
        {/* Channel Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.status === 'expiring').length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="subscribers">
          <TabsList>
            <TabsTrigger value="subscribers" className="gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscribers" className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
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
                  <p className="text-muted-foreground">No subscribers found matching "{search}"</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddUserForm(true)}
                  >
                    Add a new subscriber
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Channel analytics are being developed and will be available soon. 
                    You'll be able to track subscriber growth, engagement, and more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Settings className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">Settings Coming Soon</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Channel settings configuration is being developed and will be available soon.
                    You'll be able to customize notification settings, access controls, and more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Message Dialog */}
      {showMessageBox && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MessageBox
            user={selectedUser}
            onClose={() => {
              setShowMessageBox(false);
              setSelectedUser(null);
            }}
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

export default ChannelDetail;
