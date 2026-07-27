export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  isPinned?: boolean;
  category?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface PageContent {
  id: 'home' | 'about' | 'guide';
  title: string;
  subtitle: string;
  content: any; // can be key-value pair or structured paragraphs
  updatedAt: any;
}

export interface DesignSettings {
  id: 'main';
  primaryColor: string; // e.g. '#0F172A' (Navy)
  accentColor: string;  // e.g. '#D97706' (Gold)
  fontFamily: 'Pretendard' | 'Noto Sans KR' | 'Inter';
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  menuOrder: string[];
}

export interface SEOSettings {
  id: 'main';
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  createdAt: any;
}

export interface VisitorStats {
  id: 'stats';
  visits: number;
  pageViews: number;
  consultClicks: number; // Clicked direct consultation buttons
  blogClicks: number;    // Clicked Naver Blog button
  formClicks: number;    // Clicked Naver Form button
}
