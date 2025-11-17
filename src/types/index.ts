// Core type definitions for the wwwwwh.io platform

export interface User {
  id: string;
  email?: string;
  username?: string;
  donationTier: DonationTier;
  hardwareKeyId: string;
  createdAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
}

export interface HardwareKey {
  id: string;
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ContentItem {
  id: string;
  hash: string; // IPFS hash
  name: string;
  description?: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  menuPath: string; // ltree path in menu hierarchy
  activities: Activity[];
  emotions: Emotion[];
  groupDynamics: GroupDynamic[];
  yearCreated?: number;
  decade?: string;
  generation?: string;
  isPublicDomain: boolean;
  accessLevel: AccessLevel;
  seeders: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuHierarchy {
  id: number;
  path: string; // ltree path
  name: string;
  type: MenuType;
  parentId?: number;
  level: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface MenuTypes {
  id: number;
  menuId: number;
  fileType: string;
  mimeType: string;
  extension: string;
  category: FileCategory;
  isSupported: boolean;
}

export interface PeerConnection {
  peerId: string;
  userId?: string;
  multiaddr: string;
  isOnline: boolean;
  lastSeen: Date;
  connectionQuality: number;
  bandwidth: number;
  contentShared: string[]; // IPFS hashes
}

export interface DonationTransaction {
  id: string;
  userId: string;
  amount: number;
  tier: DonationTier;
  stripeSessionId: string;
  status: TransactionStatus;
  createdAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  peerId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

// Enums and Constants
export enum DonationTier {
  FREE = 'free',
  MEAL = 'meal',      // $3
  DRINK = 'drink',    // $8
  SNACK = 'snack'     // $15
}

export enum AccessLevel {
  PUBLIC = 'public',
  SINGLE_USER = 'single_user',
  SELECT_USERS = 'select_users',
  CONCURRENT = 'concurrent'
}

export enum MenuType {
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  COLLECTION = 'collection',
  ITEM = 'item'
}

export enum FileCategory {
  AUDIO = 'audio',
  PHOTO = 'photo',
  TEXT = 'text',
  VIDEO = 'video'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Activity System Types
export type Activity = keyof typeof CORE_ACTIVITIES;
export type Emotion = 'nostalgia' | 'happy' | 'sad' | 'love' | 'scared' | 'hurt' | 'relaxed' | 'tense';
export type GroupDynamic = 'friend' | 'family' | 'partner' | 'spouse' | 'parent' | 'child' | 'sibling' | 'cousin' | 'colleague' | 'peer' | 'competitive';

export const CORE_ACTIVITIES = {
  // Physical activities
  workout: ['high-intensity', 'motivational', 'rhythmic', 'energizing'],
  yoga: ['calming', 'flowing', 'meditative', 'balanced'],
  run: ['steady-tempo', 'motivating', 'endurance', 'rhythmic'],
  walk: ['leisurely', 'contemplative', 'moderate', 'peaceful'],
  dance: ['beat-heavy', 'infectious', 'fun', 'social'],
  
  // Daily routines
  commute: ['engaging', 'time-filling', 'personal', 'consistent'],
  morning_routine: ['energizing', 'positive', 'wake-up', 'motivational'],
  shower: ['personal', 'reflective', 'cleansing', 'private'],
  getting_ready: ['upbeat', 'confidence-boosting', 'energizing', 'quick'],
  
  // Work/productivity  
  work: ['focused', 'non-distracting', 'productive', 'background'],
  study: ['concentrated', 'ambient', 'consistent', 'brain-friendly'],
  creative_work: ['inspiring', 'flow-inducing', 'artistic', 'imaginative'],
  
  // Home activities
  clean: ['energizing', 'motivational', 'upbeat', 'productive'],
  cook: ['engaging', 'pleasant', 'background', 'enjoyable'],
  eat: ['ambient', 'conversational', 'sophisticated', 'digestive'],
  
  // Social/entertainment
  hang_out: ['social', 'easy-going', 'shareable', 'conversation-friendly'],
  party: ['celebratory', 'loud', 'social', 'exciting'],
  date: ['romantic', 'intimate', 'mood-setting', 'sophisticated'],
  
  // Relaxation/downtime
  relax: ['calming', 'stress-relief', 'gentle', 'soothing'],
  read: ['ambient', 'non-intrusive', 'atmospheric', 'contemplative'],
  game: ['engaging', 'immersive', 'focus-enhancing', 'fun'],
  sleep: ['peaceful', 'drowsy', 'calming', 'slow-tempo'],
  
  // Transportation/travel
  drive: ['engaging', 'safe-tempo', 'road-trip', 'personal'],
  fly: ['calming', 'time-passing', 'comfortable', 'distraction'],
  
  // Emotional/personal
  think: ['contemplative', 'introspective', 'space-giving', 'reflective'],
  cry: ['cathartic', 'emotional', 'healing', 'understanding'],
  celebrate: ['joyful', 'triumphant', 'special', 'memorable']
} as const;

// Request/Response Types
export interface CreateContentRequest {
  name: string;
  description?: string;
  file: Express.Multer.File;
  menuPath: string;
  activities: Activity[];
  emotions: Emotion[];
  groupDynamics: GroupDynamic[];
  yearCreated?: number;
  isPublicDomain: boolean;
  accessLevel: AccessLevel;
}

export interface ContentSearchRequest {
  query?: string;
  activities?: Activity[];
  emotions?: Emotion[];
  groupDynamics?: GroupDynamic[];
  fileTypes?: string[];
  yearRange?: [number, number];
  decade?: string;
  generation?: string;
  menuPath?: string;
  limit?: number;
  offset?: number;
}

export interface PeerDiscoveryRequest {
  contentHash: string;
  requiredBandwidth?: number;
  preferredRegion?: string;
}

export interface DonationRequest {
  tier: DonationTier;
  successUrl: string;
  cancelUrl: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// P2P Network Types
export interface P2PMessage {
  type: 'discovery' | 'content-request' | 'content-offer' | 'peer-update';
  payload: any;
  timestamp: Date;
  sender: string;
}

export interface ContentOffer {
  hash: string;
  size: number;
  chunks: number;
  bandwidth: number;
  ttl: number;
}

export interface ContentRequest {
  hash: string;
  chunks?: number[];
  priority: 'low' | 'medium' | 'high';
}

// WebRTC Types
export interface RTCConnectionState {
  peerId: string;
  connectionState: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
  dataChannelState: 'connecting' | 'open' | 'closing' | 'closed';
  bandwidth: number;
  latency: number;
}

// Database Query Types
export interface HierarchicalQuery {
  ancestorOf?: string;
  descendantOf?: string;
  level?: number;
  maxDepth?: number;
}

export interface ActivityFilter {
  activities?: Activity[];
  emotions?: Emotion[];
  groupDynamics?: GroupDynamic[];
  matchMode?: 'any' | 'all';
}