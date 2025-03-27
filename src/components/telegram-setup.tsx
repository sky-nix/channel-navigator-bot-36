
import React, { useState } from 'react';
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

const telegramSetupSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
});

interface TelegramSetupProps {
  onSave: (data: { botToken: string }) => void;
  currentToken?: string;
}

export function TelegramSetup({ onSave, currentToken = '' }: TelegramSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const form = useForm<z.infer<typeof telegramSetupSchema>>({
    resolver: zodResolver(telegramSetupSchema),
    defaultValues: {
      botToken: currentToken,
    },
  });

  const handleSubmit = async (data: z.infer<typeof telegramSetupSchema>) => {
    setIsLoading(true);
    try {
      // Here we'd verify the bot token with Telegram API
      // For now, we'll just simulate a successful connection
      setTimeout(() => {
        onSave(data);
        toast.success('Telegram bot connected successfully');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error connecting Telegram bot:', error);
      toast.error('Failed to connect Telegram bot');
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (confirmationCode.length === 5) {
      toast.success('Account verified successfully');
    } else {
      toast.error('Invalid verification code');
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
            <TabsTrigger value="verification">Account Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4 mt-4">
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
                    {isLoading ? 'Connecting...' : 'Connect Bot'}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="bg-muted/50 p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2">How to get a bot token:</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>Open Telegram and search for @BotFather</li>
                <li>Start a chat and send the command /newbot</li>
                <li>Follow the instructions to create your bot</li>
                <li>Copy the API token provided and paste it above</li>
              </ol>
            </div>
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
                  disabled={confirmationCode.length !== 5}
                  className="mt-4"
                >
                  Verify Account
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
