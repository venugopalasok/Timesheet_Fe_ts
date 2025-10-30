// API service for authentication operations
// Communicates with auth-service (port 3002)

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3002';

// Token storage keys
const TOKEN_KEY = 'timesheet_auth_token';
const USER_KEY = 'timesheet_user';

// ========== TYPES ==========

export interface User {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProfileResponse {
  message: string;
  user: User;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UsersResponse {
  message: string;
  users: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserResponse {
  message: string;
  user: User;
}

// ========== TOKEN MANAGEMENT ==========

/**
 * Store JWT token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 */
export const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove user data from localStorage
 */
export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  removeStoredUser();
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Get authorization header with JWT token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ========== API CALLS ==========

/**
 * Check the health status of auth-service
 */
export const checkAuthServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/health`);
    return response.ok;
  } catch (error) {
    console.error('Auth service health check failed:', error);
    return false;
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    // Store token and user data
    setAuthToken(responseData.token);
    setStoredUser(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    // Store token and user data
    setAuthToken(responseData.token);
    setStoredUser(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout user (clear local storage)
 */
export const logout = (): void => {
  clearAuthData();
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      // If unauthorized, clear auth data
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Update stored user data
    setStoredUser(data.user);

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    // Update stored user data
    setStoredUser(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Verify if current token is valid
 */
export const verifyToken = async (): Promise<ProfileResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/verify-token`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Update stored user data
    setStoredUser(data.user);

    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    clearAuthData();
    throw error;
  }
};

/**
 * Get all users (admin/manager only)
 */
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<UsersResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const response = await fetch(
      `${AUTH_SERVICE_URL}/auth-service/users?${params.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID (admin/manager only)
 */
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth-service/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Helper function to get current user from storage
 */
export const getCurrentUser = (): User | null => {
  return getStoredUser();
};

/**
 * Helper function to get user's full name
 */
export const getUserFullName = (user: User | null): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
};

/**
 * Helper function to check if user has a specific role
 */
export const hasRole = (user: User | null, role: 'user' | 'admin' | 'manager'): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Helper function to check if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Helper function to check if user is manager
 */
export const isManager = (user: User | null): boolean => {
  return hasRole(user, 'manager');
};

/**
 * Helper function to get user's employee ID
 */
export const getUserEmployeeId = (user: User | null): string => {
  if (!user) return '';
  return user.employeeId;
};

