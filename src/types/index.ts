export interface User {
  id: string;
  email: string;
  username: string;
  reputationScore: number;
  avatar?: string;
  createdAt: Date;
  uid?: string; // Firebase UID
  displayName?: string; // Firebase display name
  photoURL?: string; // Firebase photo URL
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  title?: string;
  content: string;
  tags: string[];
  lenses: InterpretationLens[];
  interpretations: Interpretation[];
  comments: Comment[];
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  isAnonymous: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  parentId?: string;
  replies: Comment[];
  upvotes: number;
  downvotes: number;
  reactions: Reaction[];
  toneBadges: string[];
  createdAt: Date;
  isPinned: boolean;
}

export interface Reaction {
  id: string;
  userId: string;
  type: 'insightful' | 'supportive' | 'thoughtful';
  emoji: string;
}

export interface Interpretation {
  id: string;
  lens: InterpretationLens;
  content: string;
  createdAt: Date;
}

export type InterpretationLens = 
  | 'therapist'
  | 'philosophical' 
  | 'cultural'
  | 'spiritual'
  | 'sociological';

export type SortOption = 'relevant' | 'upvoted' | 'thoughtful';

export type Category = 
  | 'work'
  | 'parenting'
  | 'identity'
  | 'religion'
  | 'relationships'
  | 'loss'
  | 'growth'
  | 'mental-health'
  | 'social-pressure';