const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MODERATOR' | 'MENTOR' | 'PARTICIPANT';
  age?: number;
  phone?: string;
  active: boolean;
  country?: { id: string; name: string; flagEmoji?: string };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setAuth(token: string, user: User) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Erreur serveur');
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: Record<string, unknown>) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => request<User>('/auth/me'),
  countries: () => request<Array<{ id: string; name: string; flagEmoji?: string }>>('/countries'),
  hackathons: () => request<unknown[]>('/hackathons'),
  courses: (published = true) => request<unknown[]>(`/courses?published=${published}`),
  news: (published = true) => request<unknown[]>(`/news?published=${published}`),
  stats: () =>
    request<{
      totals: Record<string, number>;
      projectsByStatus: Array<{ status: string; _count: number }>;
      usersByRole: Array<{ role: string; _count: number }>;
    }>('/stats/dashboard'),
  users: () => request<User[]>('/users'),
  createUser: (data: Record<string, unknown>) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: Record<string, unknown>) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
  projects: () => request<Project[]>('/projects'),
  myProjects: () => request<Project[]>('/projects/mine'),
  createProject: (data: Record<string, unknown>) =>
    request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
};

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  heritage?: string;
  author?: { firstName: string; lastName: string };
  country?: { name: string; flagEmoji?: string };
  createdAt?: string;
}
