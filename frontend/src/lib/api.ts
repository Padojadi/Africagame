const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type UserRole = 'EXPLOITANT' | 'REGULATEUR' | 'OPERATEUR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active?: boolean;
  mfaEnabled?: boolean;
  jurisdictionId?: string | null;
  gameOperatorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  jurisdiction?: { id: string; name: string; code: string; currency?: { code: string; symbol: string } };
  gameOperator?: { id: string; name: string; licenseNumber: string };
}

export interface Dashboard {
  totals: {
    payments: number;
    bets: number;
    jurisdictions: number;
    operators: number;
    outsidePayments: number;
    undeclaredBets: number;
    paymentVolume: number;
    pbj: number;
  };
  byChannel: Array<{ channel: string; _count: number; _sum: { amount: number } }>;
  role: UserRole;
}

function getToken() {
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
    request<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<User>('/auth/me'),
  dashboard: () => request<Dashboard>('/reporting/dashboard'),
  payments: (params?: string) => request<Payment[]>(`/payments${params ? `?${params}` : ''}`),
  bets: (params?: string) => request<Bet[]>(`/bets${params ? `?${params}` : ''}`),
  pbj: () => request<{ pbj: number; count: number }>('/bets/pbj'),
  invoices: () => request<Invoice[]>('/fiscal/invoices'),
  jurisdictions: () => request<Jurisdiction[]>('/jurisdictions'),
  operators: () => request<GameOperator[]>('/game-operators'),
  audit: () => request<Array<{
    id: string; action: string; entity: string; entityId?: string;
    createdAt: string; user?: { email: string; firstName: string; role: string };
  }>>('/audit'),
  responsibleGaming: () => request<Array<{
    id: string; msisdn?: string; riskLevel: string;
    totalDeposits: number; totalBets: number; notes?: string;
  }>>('/responsible-gaming'),
  users: () => request<User[]>('/users'),
  createUser: (data: Record<string, unknown>) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: Record<string, unknown>) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};

export interface Payment {
  id: string;
  nature: string;
  amount: number;
  currencyCode: string;
  channel: string;
  msisdn?: string;
  status: string;
  operatedAt: string;
  gameOperator?: { name: string };
  jurisdiction?: { name: string };
}

export interface Bet {
  id: string;
  nature: string;
  amount: number;
  currencyCode: string;
  channel: string;
  gameType: string;
  msisdn?: string;
  status: string;
  operatedAt: string;
  gameOperator?: { name: string };
}

export interface Invoice {
  id: string;
  periodStart: string;
  periodEnd: string;
  pbjAmount: number;
  levyAmount: number;
  currencyCode: string;
  status: string;
  gameOperator?: { name: string };
  jurisdiction?: { name: string };
}

export interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  timezone: string;
  currency?: { code: string; symbol: string };
  allowedChannels?: Array<{ channel: string; enabled: boolean }>;
  _count?: { gameOperators: number };
}

export interface GameOperator {
  id: string;
  name: string;
  licenseNumber: string;
  jurisdiction?: { name: string };
}
