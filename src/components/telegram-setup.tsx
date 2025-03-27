
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const telegramSetupSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
});

interface TelegramSetupProps {
  onSave: (data: { botToken: string }) => void;
  currentToken?: string;
}

interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export function TelegramSetup({ onSave, currentToken = '' }: TelegramSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [botInfo, setBotInfo] = useState<TelegramBotInfo | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const form = useForm<z.infer<typeof telegramSetupSchema>>({
    resolver: zodResolver(telegramSetupSchema),
    defaultValues: {
      botToken: currentToken || '',
    },
  });

  // Check if we already have a valid token on component mount
  useEffect(() => {
    if (currentToken) {
      verifyBotToken(currentToken);
    }
  }, [currentToken]);

  const verifyBotToken = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setBotInfo(data.result);
        return true;
      } else {
        console.error('Bot token verification failed:', data.description);
        toast.error(`Verification failed: ${data.description}`);
        setBotInfo(null);
        return false;
      }
    } catch (error) {
      console.error('Error verifying bot token:', error);
      toast.error('Failed to verify bot token. Please check your internet connection.');
      setBotInfo(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof telegramSetupSchema>) => {
    setIsLoading(true);
    const isValid = await verifyBotToken(data.botToken);
    
    if (isValid) {
      onSave({ botToken: data.botToken });
      toast.success('Telegram bot connected successfully!');
      
      // Start the verification process
      setVerificationInProgress(true);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationCode.length === 5) {
      setIsLoading(true);
      
      // In a real app, you would verify this code with your backend
      // Here we'll simulate a verification delay
      setTimeout(() => {
        toast.success('Account verification completed successfully');
        setIsLoading(false);
        setVerificationInProgress(false);
      }, 1500);
    } else {
      toast.error('Invalid verification code');
    }
  };

  const sendTestMessage = async () => {
    if (!botInfo || !currentToken) return;
    
    setIsLoading(true);
    try {
      // This would typically be handled by your backend
      // For testing purposes, we're making the API call directly
      // Note: In production, you would need a chat_id of an actual user who has interacted with your bot
      toast.info('This feature would send a test message via your bot to a specific chat_id');
      
      setTimeout(() => {
        toast.success('Test message would be sent in a production environment');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('Failed to send test message');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Telegram Integration</CardTitle>
        <CardDescription>
          Connect your Telegram bot to manage your channels and automate messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Bot Setup</TabsTrigger>
            <TabsTrigger value="verification" disabled={!botInfo}>Account Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4 mt-4">
            {botInfo ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                  <h3 className="text-green-800 dark:text-green-300 font-medium text-sm">Bot Connected Successfully</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm">Name: <span className="font-medium">{botInfo.first_name}</span></p>
                    <p className="text-sm">Username: <span className="font-medium">@{botInfo.username}</span></p>
                    <p className="text-sm">Bot ID: <span className="font-medium">{botInfo.id}</span></p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setBotInfo(null)}
                    >
                      Disconnect
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={sendTestMessage}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : 'Send Test Message'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Make sure your bot has permission to read messages (if needed)</li>
                    <li>Add the bot to your channels as an administrator</li>
                    <li>Configure webhook settings for real-time updates</li>
                  </ol>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="botToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Token</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your Telegram bot token" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Create a bot via <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary underline">@BotFather</a> and paste the token here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : 'Connect Bot'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            
            {!botInfo && (
              <div className="bg-muted/50 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">How to get a bot token:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Open Telegram and search for @BotFather</li>
                  <li>Start a chat and send the command /newbot</li>
                  <li>Follow the instructions to create your bot</li>
                  <li>Copy the API token provided and paste it above</li>
                </ol>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Enter Verification Code</Label>
              <p className="text-sm text-muted-foreground mb-4">
                We've sent a code to your Telegram account. Please enter it below to verify your account.
              </p>
              
              <div className="flex flex-col items-center space-y-4">
                <InputOTP 
                  maxLength={5}
                  value={confirmationCode}
                  onChange={setConfirmationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
                
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={confirmationCode.length !== 5 || isLoading}
                  className="mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : 'Verify Account'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Your data is stored securely and used only for sending notifications to your subscribers.
        </p>
      </CardFooter>
    </Card>
  );
}
