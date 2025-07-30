import { Post, Interpretation, InterpretationLens } from '../types';

export const generateMockInterpretations = (lenses: InterpretationLens[]): Interpretation[] => {
  const interpretations: Record<string, string> = {
    therapist: `From a therapeutic perspective, this experience reflects common patterns in emotional processing. The feelings you're describing suggest a natural response to change and uncertainty. Consider exploring what specific aspects trigger the strongest emotions, as this can help identify underlying needs or values that might be seeking attention.`,
    
    philosophical: `Philosophically, your experience touches on fundamental questions about meaning and identity. The ancient Stoics would say that our suffering comes not from events themselves, but from our judgments about them. This moment of confusion might be an invitation to examine what assumptions about life or self are being challenged.`,
    
    cultural: `From a cultural lens, many societies have rituals and narratives for navigating similar transitions. Your experience resonates with universal themes found across cultures - the hero's journey, rites of passage, or what anthropologists call 'liminal spaces' - periods between what was and what will be.`,
    
    spiritual: `Spiritually, periods of confusion often precede growth and deeper understanding. Many wisdom traditions view such experiences as opportunities for surrender and trust in a larger process. Consider whether this experience might be inviting you to release old patterns and remain open to new possibilities.`,
    
    sociological: `From a sociological perspective, individual experiences are often shaped by broader social forces and expectations. Consider how societal norms, family dynamics, or cultural pressures might be influencing your situation. Sometimes what feels like personal confusion reflects larger collective tensions.`
  };

  return lenses.map((lens, index) => ({
    id: `interp_${index}`,
    lens,
    content: interpretations[lens] || "This lens provides a unique perspective on your experience.",
    createdAt: new Date()
  }));
};

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'seeker_of_truth',
    title: 'Feeling lost after a major life transition',
    content: `I recently moved to a new city for work, leaving behind all my friends and familiar places. While I know this was the right decision logically, I feel completely disconnected and question if I made the right choice. The loneliness is overwhelming, and I find myself wondering who I am without my old support system.`,
    tags: ['transition', 'loneliness', 'identity', 'career'],
    lenses: ['therapist', 'philosophical', 'cultural'],
    interpretations: generateMockInterpretations(['therapist', 'philosophical', 'cultural']),
    comments: [],
    createdAt: new Date(Date.now() - 86400000),
    upvotes: 23,
    downvotes: 2,
    isAnonymous: true
  },
  {
    id: '2',
    userId: 'user2',
    username: 'parent_in_progress',
    content: `My teenage daughter has been increasingly distant and hostile. Every conversation turns into an argument. I want to connect with her but feel like I'm failing as a parent. I remember being her age and feeling misunderstood, yet I can't seem to bridge this gap. How do I show love when it feels rejected?`,
    tags: ['parenting', 'teenagers', 'communication', 'family'],
    lenses: ['therapist', 'sociological'],
    interpretations: generateMockInterpretations(['therapist', 'sociological']),
    comments: [],
    createdAt: new Date(Date.now() - 172800000),
    upvotes: 31,
    downvotes: 1,
    isAnonymous: true
  }
];