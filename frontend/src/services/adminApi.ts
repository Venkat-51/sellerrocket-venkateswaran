/**
 * Admin API service - handles all admin authentication and lead management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface LoginResponse {
  success: boolean;
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
  };
}

interface LeadsResponse {
  success: boolean;
  data: {
    leads: any[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      pages: number;
    };
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    totalLeads: number;
    recentLeads: number;
    convertedLeads: number;
    conversionRate: string;
    leadsByStatus: Array<{ status: string; count: number }>;
    leadsByPlatform: Array<{ platform: string; count: number }>;
  };
}

class AdminAPI {
  private getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async getLeads(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      status?: string;
      platform?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<LeadsResponse> {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.platform && { platform: filters.platform }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await fetch(`${API_BASE_URL}/admin/leads?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch leads');
    }

    return response.json();
  }

  async getLead(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/leads/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch lead');
    }

    const data = await response.json();
    return data.lead;
  }

  async updateLead(
    id: number,
    data: {
      status?: string;
      name?: string;
      email?: string;
      phone?: string;
      platform?: string;
      message?: string;
    }
  ): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/leads/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update lead');
    }

    const result = await response.json();
    return result.lead;
  }

  async deleteLead(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/leads/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete lead');
    }
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch analytics');
    }

    return response.json();
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }

    return response.json();
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const adminAPI = new AdminAPI();
