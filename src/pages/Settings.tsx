
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bell, User, Shield, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { TelegramSetup } from '@/components/telegram-setup';

const STORAGE_KEY = 'telegram_bot_settings';

const Settings = () => {
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    isConnected: false,
  });
  
  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTelegramSettings(parsed);
      } catch (error) {
        console.error('Error parsing saved Telegram settings:', error);
      }
    }
  }, []);
  
  const handleSaveNotifications = () => {
    toast.success('Notification settings saved');
  };
  
  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };
  
  const handleSaveSecurity = () => {
    toast.success('Security settings saved');
  };
  
  const handleSaveTelegramSettings = (data: { botToken: string }) => {
    const newSettings = {
      botToken: data.botToken,
      isConnected: true,
    };
    
    setTelegramSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        
        <Tabs defaultValue="notifications">
          <TabsList className="grid grid-cols-4 md:w-[500px]">
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="telegram" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Telegram</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified about channel activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-subscribers" className="text-base">New Subscribers</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new users join your channels</p>
                    </div>
                    <Switch id="new-subscribers" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="expiring-subscriptions" className="text-base">Expiring Subscriptions</Label>
                      <p className="text-sm text-muted-foreground">Get notified when subscriptions are about to expire</p>
                    </div>
                    <Switch id="expiring-subscriptions" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="removed-subscribers" className="text-base">Removed Subscribers</Label>
                      <p className="text-sm text-muted-foreground">Get notified when subscribers are removed from channels</p>
                    </div>
                    <Switch id="removed-subscribers" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="direct-messages" className="text-base">Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you receive a direct message</p>
                    </div>
                    <Switch id="direct-messages" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="admin@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="A short bio about yourself..." />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSecurity}>Update Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="telegram" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Telegram Integration</CardTitle>
                <CardDescription>Connect your Telegram bot to manage channels and automate messages</CardDescription>
              </CardHeader>
              <CardContent>
                <TelegramSetup 
                  onSave={handleSaveTelegramSettings}
                  currentToken={telegramSettings.botToken}
                />
                
                {telegramSettings.isConnected && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="webhook-enabled" className="text-base">Enable Webhook</Label>
                          <p className="text-sm text-muted-foreground">Receive real-time updates from Telegram</p>
                        </div>
                        <Switch id="webhook-enabled" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-responses" className="text-base">Auto Responses</Label>
                          <p className="text-sm text-muted-foreground">Automatically respond to common commands</p>
                        </div>
                        <Switch id="auto-responses" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
