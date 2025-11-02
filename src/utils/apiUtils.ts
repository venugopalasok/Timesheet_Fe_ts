/**
 * Normalizes API URLs to use HTTPS when the page is served over HTTPS
 * This prevents Mixed Content errors when the frontend is deployed on HTTPS
 * but the backend URL is configured with HTTP
 * 
 * @param url - The API URL (can be HTTP or HTTPS)
 * @returns The normalized URL (HTTPS if page is HTTPS, otherwise unchanged)
 */
export const normalizeApiUrl = (url: string): string => {
  // If URL is already HTTPS, return as-is
  if (url.startsWith('https://')) {
    return url;
  }

  // If URL is HTTP and we're on HTTPS page (production), convert to HTTPS
  if (url.startsWith('http://')) {
    // Check if we're in a browser environment and page is served over HTTPS
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      // Convert http:// to https://
      return url.replace('http://', 'https://');
    }
  }

  // Return URL as-is (for local development with HTTP)
  return url;
};

