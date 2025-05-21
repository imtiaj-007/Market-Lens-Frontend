// From frontend/src/components/pages/analytics.tsx
export interface SalesSummaryData {
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    avgOrderValue: number;
    revenueChange?: string;
    ordersChange?: string;
    customersChange?: string;
    avgOrderValueChange?: string;
}

export interface ForecastData {
    dates: string[];
    values: number[];
    upper_bound: number[];
    lower_bound: number[];
}

// This is the detailed version from frontend/src/components/dashboard/CustomerSegments.tsx
// and aligns with the backend data structure provided by the user.
export interface RFMAverage {
    recency: number;
    frequency: number;
    monetary: number;
}

export interface CustomerSegment {
    segment_id: number;
    name: string;
    count: number;
    percentage: number;
    rfm_avg: RFMAverage;
    characteristics: string[];
    color?: string; // Optional: if you want to assign specific colors via data
}

// Wrapper for segment data, also from frontend/src/components/dashboard/CustomerSegments.tsx
export interface SegmentData {
    segments: CustomerSegment[];
    total_customers: number;
}

export interface ProductData {
    name: string;
    revenue: number;
    quantity: number;
    avg_price: number;
    growth: number;
}

export interface CategoryData {
    name: string;
    revenue: number;
    products_count: number;
    percentage: number;
}

export interface PerformanceData {
    products: ProductData[];
    categories: CategoryData[];
    total_revenue: number;
    total_products: number;
} 