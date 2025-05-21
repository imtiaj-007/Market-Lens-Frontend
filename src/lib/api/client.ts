import {
  AnomalyDetection,
  AnomalyParams,
  CustomerDetail,
  CustomerSegments,
  ForecastParams,
  SalesForecast,
  SalesSummary,
  SummaryParams,
  UploadResponse
} from '../types/api';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Market Lens API Client
 * Handles all communication with the backend API
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch method with error handling
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.fetchApi('/api/health');
  }

  // Sales endpoints
  async getSalesSummary(params?: SummaryParams): Promise<SalesSummary> {
    const queryParams = params?.period ? `?period=${params.period}` : '';
    return this.fetchApi(`/api/sales/summary${queryParams}`);
  }

  async getSalesForecast(params?: ForecastParams): Promise<SalesForecast> {
    const queryParams = new URLSearchParams();
    if (params?.periods) queryParams.append('periods', params.periods.toString());
    if (params?.time_unit) queryParams.append('time_unit', params.time_unit);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.fetchApi(`/api/sales/forecast${query}`);
  }

  async getSalesAnomalies(params?: AnomalyParams): Promise<AnomalyDetection> {
    const queryParams = params?.lookback_days 
      ? `?lookback_days=${params.lookback_days}` 
      : '';
    return this.fetchApi(`/api/sales/anomalies${queryParams}`);
  }

  // Customer endpoints
  async getCustomerSegments(): Promise<CustomerSegments> {
    return this.fetchApi('/api/customers/segments');
  }

  async getCustomerDetails(customerId: string): Promise<CustomerDetail> {
    return this.fetchApi(`/api/customers/details/${customerId}`);
  }

  // File upload
  async uploadFile(file: File, analysisType?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (analysisType) {
      formData.append('analysis_type', analysisType);
    }

    return this.fetchApi('/api/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - browser handles it
      },
      body: formData,
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Also export the class for testing purposes
export default ApiClient; 