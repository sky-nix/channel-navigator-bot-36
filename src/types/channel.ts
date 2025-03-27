
export interface Channel {
  id: string;
  name: string;
  description?: string;
  subscriberCount: number;
  newSubscribers: number;
  expiringSubscribers: number;
  isActive: boolean;
  createdAt: string;
}
