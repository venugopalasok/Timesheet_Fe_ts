import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getProfile,
  updateProfile as apiUpdateProfile,
  changePassword as apiChangePassword,
  verifyToken,
  getStoredUser,
  isAuthenticated as checkIsAuthenticated,
} from '../services/authAPI'
import type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from '../services/authAPI'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if user has token in localStorage
      if (checkIsAuthenticated()) {
        // Try to verify token and get user data
        try {
          const response = await verifyToken()
          setUser(response.user)
        } catch (err) {
          // Token is invalid, clear stored data
          console.error('Token verification failed:', err)
          setUser(null)
        }
      } else {
        // No token, check for stored user data (for offline display)
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiLogin(data)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiRegister(data)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    setError(null)
  }

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiUpdateProfile(data)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      await apiChangePassword(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const response = await getProfile()
      setUser(response.user)
    } catch (err) {
      console.error('Failed to refresh user:', err)
      // Don't throw error, just log it
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && checkIsAuthenticated(),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

