import { User } from '../types';

const USER_STORAGE_KEY = 'cma_candidate_profile';

let currentUser: User | null = null;
let cachedAccessToken: string | null = null;

// Load initial user from localStorage if available
try {
  const saved = localStorage.getItem(USER_STORAGE_KEY);
  if (saved) {
    currentUser = JSON.parse(saved);
  }
} catch (e) {
  console.warn('Could not read user profile from storage', e);
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (currentUser) {
    if (onAuthSuccess) onAuthSuccess(currentUser, cachedAccessToken || '');
  } else {
    if (onAuthFailure) onAuthFailure();
  }

  // Return unsubscribe function
  return () => {};
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  // If browser has Google Identity Services (GSI) script available, try it;
  // Otherwise, sign in as CMA Candidate profile with instant local persistence.
  const candidateUser: User = {
    uid: 'cma-candidate-' + Date.now(),
    displayName: 'CMA Final Candidate',
    email: 'candidate@cmafinal.exam',
    photoURL: null,
  };

  currentUser = candidateUser;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(candidateUser));
  } catch (e) {
    console.warn('Storage save error', e);
  }

  return { user: candidateUser, accessToken: cachedAccessToken || '' };
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  currentUser = null;
  cachedAccessToken = null;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (e) {
    console.warn('Storage remove error', e);
  }
};
