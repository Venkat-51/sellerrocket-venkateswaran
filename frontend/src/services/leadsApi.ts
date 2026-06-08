/**
 * API Service for Backend Communication
 * Use this service in your React components to interact with the backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Lead {
  id?: number;
  name: string;
  phone: string;
  email: string;
  platform: string;
  message?: string;
  status?: 'New' | 'Contacted' | 'Converted' | 'Rejected';
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  /**
   * Create a new lead
   */
  async createLead(lead: Omit<Lead, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const response = await this.request<{ lead: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
    return response.lead;
  }

  /**
   * Get all leads
   */
  async getAllLeads(platform?: string): Promise<Lead[]> {
    const params = new URLSearchParams();
    if (platform) {
      params.append('platform', platform);
    }
    const endpoint = params.toString() ? `/leads?${params}` : '/leads';
    const response = await this.request<{ leads: Lead[] }>(endpoint);
    return response.leads;
  }

  /**
   * Get a specific lead by ID
   */
  async getLeadById(id: number): Promise<Lead> {
    const response = await this.request<{ lead: Lead }>(`/leads/${id}`);
    return response.lead;
  }

  /**
   * Update a lead's status
   */
  async updateLeadStatus(
    id: number,
    status: 'New' | 'Contacted' | 'Converted' | 'Rejected'
  ): Promise<Lead> {
    const response = await this.request<{ lead: Lead }>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.lead;
  }

  /**
   * Delete a lead
   */
  async deleteLead(id: number): Promise<void> {
    await this.request('/leads/' + id, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
