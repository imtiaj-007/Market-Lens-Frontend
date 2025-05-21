/**
 * API client for connecting to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload a file to the backend
 */
export async function uploadFile(file: File, analysisType?: string): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (analysisType) {
    formData.append('analysis_type', analysisType);
  }
  
  const url = `${API_BASE_URL}/api/upload`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(error.detail || `Upload error: ${response.status}`);
  }

  return response.json();
}

/**
 * Sales API endpoints
 */
export const salesApi = {
  getForecast: (periods: number = 30, timeUnit: string = 'D') => 
    fetchAPI<any>(`/api/sales/forecast?periods=${periods}&time_unit=${timeUnit}`),
  
  getAnomalies: (lookbackDays: number = 90) => 
    fetchAPI<any>(`/api/sales/anomalies?lookback_days=${lookbackDays}`),
  
  getSummary: (period: string = '30d') => 
    fetchAPI<any>(`/api/sales/summary?period=${period}`),
};

/**
 * Customers API endpoints
 */
export const customersApi = {
  getSegments: () => 
    fetchAPI<any>('/api/customers/segments'),
  
  getCustomerDetails: (customerId: string) => 
    fetchAPI<any>(`/api/customers/details/${customerId}`),
};

/**
 * Products API endpoints
 */
export const productsApi = {
  getPerformance: (timePeriod: string = '30d', limit: number = 10) => 
    fetchAPI<any>(`/api/products/performance?time_period=${timePeriod}&limit=${limit}`),
  
  getTrends: (productId?: string, category?: string, timePeriod: string = '30d') => {
    let url = `/api/products/trends?time_period=${timePeriod}`;
    if (productId) url += `&product_id=${productId}`;
    if (category) url += `&category=${category}`;
    return fetchAPI<any>(url);
  },
};

/**
 * Health check
 */
export const checkApiHealth = (): Promise<{ status: string; timestamp: string; version: string }> => 
  fetchAPI('/api/health'); 