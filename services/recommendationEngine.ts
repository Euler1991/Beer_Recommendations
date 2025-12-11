import { UserProfile, RecommendationResult } from '../types';
import { CRAFT_STYLES } from '../constants';

// Euclidean distance between two users based on their commercial beer ratings
const calculateDistance = (targetRatings: Record<string, number>, expertRatings: Record<string, number>): number => {
  let sumSquares = 0;
  const commonKeys = Object.keys(targetRatings).filter(key => key in expertRatings);
  
  // If no common keys, return max distance (very distinct)
  if (commonKeys.length === 0) return Number.MAX_VALUE;

  for (const key of commonKeys) {
    const diff = targetRatings[key] - expertRatings[key];
    sumSquares += diff * diff;
  }

  return Math.sqrt(sumSquares);
};

export const generateRecommendations = (
  targetRatings: Record<string, number>,
  experts: UserProfile[]
): { results: RecommendationResult[], neighbors: string[] } => {
  
  // 1. Calculate Similarity for all experts
  const expertsWithSimilarity = experts.map(expert => {
    const distance = calculateDistance(targetRatings, expert.commercialRatings);
    // Similarity inverse to distance. +1 to avoid division by zero.
    // Higher score = More similar.
    const similarity = 1 / (1 + distance); 
    return { ...expert, similarity, distance };
  });

  // 2. Find Top 5 Neighbors
  // Sort by similarity descending
  expertsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
  const kNearestNeighbors = expertsWithSimilarity.slice(0, 5);

  // 3. Weighted Average for Craft Styles
  const styleScores: Record<string, { totalWeightedScore: number; totalSimilarity: number }> = {};

  // Initialize accumulators
  CRAFT_STYLES.forEach(style => {
    styleScores[style.id] = { totalWeightedScore: 0, totalSimilarity: 0 };
  });

  kNearestNeighbors.forEach(neighbor => {
    if (!neighbor.craftRatings) return;

    for (const [styleId, rating] of Object.entries(neighbor.craftRatings)) {
      if (styleScores[styleId]) {
        styleScores[styleId].totalWeightedScore += rating * neighbor.similarity;
        styleScores[styleId].totalSimilarity += neighbor.similarity;
      }
    }
  });

  // 4. Final Score Calculation (Probability of Affinity)
  const results: RecommendationResult[] = CRAFT_STYLES.map(style => {
    const data = styleScores[style.id];
    let normalizedScore = 0;

    if (data.totalSimilarity > 0) {
      // Weighted Average (1-5 scale)
      const avgRating = data.totalWeightedScore / data.totalSimilarity;
      // Normalize 1-5 to 0-100%
      // (Value - Min) / (Max - Min) * 100
      // (avg - 1) / (5 - 1) * 100
      normalizedScore = Math.max(0, ((avgRating - 1) / 4) * 100);
    }

    return {
      styleId: style.id,
      styleName: style.name,
      category: style.category || 'Ale',
      affinityScore: Math.round(normalizedScore),
    };
  });

  // Sort by affinity descending
  results.sort((a, b) => b.affinityScore - a.affinityScore);

  return {
    results,
    neighbors: kNearestNeighbors.map(n => n.name)
  };
};