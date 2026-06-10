// src/utils/getSegment.ts

export const getSegment = () => {
  if (typeof window === 'undefined') return 'unknown';

  const path = window.location.pathname.toLowerCase();

  if (path.includes('graduation')) return 'graduation';
  if (path.includes('couple')) return 'couple';

  return 'general';
};
