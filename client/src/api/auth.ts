import type { AuthResponse, User } from '../types/auth'
import { request } from './http'

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// "Who am I?" Checks that a saved token is still valid
export function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>('/api/auth/me')
}
