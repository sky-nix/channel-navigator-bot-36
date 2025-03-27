
export interface User {
  id: string;
  name: string;
  username: string;
  channelId: string;
  joinedAt: string;
  expiresAt: string;
  status: 'active' | 'expiring' | 'expired';
}
