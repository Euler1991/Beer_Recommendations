export interface BeerItem {
  id: string;
  name: string;
  type: 'commercial' | 'craft';
  category?: 'Lager' | 'Ale';
  description?: string;
}

export interface UserRating {
  beerId: string;
  rating: number; // 1 to 5
}

export interface UserProfile {
  id: string;
  name: string;
  type: 'UPT' | 'TPU'; // UPT: Uno Para Todos (Expert), TPU: Todos Para Uno (Novice)
  commercialRatings: Record<string, number>;
  craftRatings?: Record<string, number>; // Only for UPT
}

export interface RecommendationResult {
  styleId: string;
  styleName: string;
  affinityScore: number; // 0 to 100
  category: 'Lager' | 'Ale';
}

export interface GeminiInsight {
  title: string;
  content: string;
}