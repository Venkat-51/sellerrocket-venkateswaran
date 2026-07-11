// API base URL - uses environment variable or defaults to localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Lead {
  name: string;
  phone: string;
  email: string;
  platform: string;
  message?: string;
}

export interface LeadResponse extends Lead {
  id: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Create a new lead
 */
export const createLead = async (data: Lead): Promise<LeadResponse> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create lead';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch (e) {
      // Couldn't parse error response
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.lead || result;
};

/**
 * Get all leads with optional platform filter
 */
export const getLeads = async (platform?: string): Promise<LeadResponse[]> => {
  const url = new URL(`${API_BASE_URL}/leads/`);
  if (platform) {
    url.searchParams.append('platform', platform);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (
  id: number,
  status: string
): Promise<LeadResponse> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update lead status');
  }

  return response.json();
};

/**
 * Delete a lead
 */
export const deleteLead = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }
};
