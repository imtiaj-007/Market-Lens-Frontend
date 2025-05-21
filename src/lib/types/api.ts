// API Types for Market Lens
// These interfaces map to the backend Pydantic models

// Common Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Sales Types
export interface SalesSummary {
  total_revenue: number;
  order_count: number;
  average_order_value: number;
  period_growth: number;
  top_products: TopProduct[];
}

export interface TopProduct {
  name: string;
  revenue: number;
  quantity: number;
}

export interface SalesForecast {
  dates: string[];
  values: number[];
  upper_bound: number[];
  lower_bound: number[];
}

export interface AnomalyDetection {
  dates: string[];
  values: number[];
  anomalies: boolean[];
  anomaly_scores: number[];
}

// Customer Types
export interface CustomerSegment {
  segment_id: number;
  name: string;
  count: number;
  percentage: number;
  rfm_avg: {
    recency: number;
    frequency: number;
    monetary: number;
  };
  characteristics: string[];
}

export interface CustomerSegments {
  segments: CustomerSegment[];
  total_customers: number;
}

export interface CustomerDetail {
  customer_id: string;
  segment_id: number;
  segment_name: string;
  recency: number;
  frequency: number;
  monetary: number;
  last_purchase: string;
  first_purchase: string;
  product_categories: string[];
  lifetime_value: number;
}

// Product Types
export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  subcategory: string;
  brand: string;
  supplier: string;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  reorder_level: number;
  rating: number;
  launch_date: string;
}

// Upload Types
export interface UploadResponse {
  filename: string;
  size: number;
  summary: {
    rows: number;
    columns: number;
    column_names: string[];
    data_preview: Record<string, string | number | boolean | null>[];
  };
  message: string;
}

// Request Types
export interface ForecastParams {
  periods?: number;
  time_unit?: 'D' | 'W' | 'M';
}

export interface AnomalyParams {
  lookback_days?: number;
}

export interface SummaryParams {
  period?: '7d' | '30d' | '90d' | '12m';
} 