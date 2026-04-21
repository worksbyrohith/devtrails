export type UserRole = 'User' | 'Admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio: string;
  latitude: number;
  longitude: number;
  skillsOffered: string[];
  skillsDesired: string[];
  avgRating: number;
}

export interface Skill {
  id: number;
  userId: number;
  title: string;
  category: string;
  description: string;
  distanceMiles: number;
  ownerName: string;
  ownerBio: string;
  ownerRating: number;
  transactionRate: number;
}

export type SwapStatus = 'PendingOutbound' | 'PendingInbound' | 'Active' | 'Completed';

export interface SwapRequest {
  id: number;
  skillId: number;
  skillTitle: string;
  proposerId: number;
  proposerName: string;
  receiverId: number;
  receiverName: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  createdAt: string;
  status: SwapStatus;
  hasPendingReview: boolean;
}

export interface Review {
  id: number;
  swapId: number;
  fromUserId: number;
  toUserId: number;
  stars: number;
  communication: number;
  punctuality: number;
  quality: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  read: boolean;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
