'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/page-layout';
import SalesChart from '@/components/dashboard/SalesChart';
import CustomerSegments from '@/components/dashboard/customer-segments';
import ProductPerformance from '@/components/dashboard/ProductPerformance';
import { salesApi, customersApi, productsApi } from '@/lib/api'; // Import API functions
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
// Import types from the new central location
import { 
    SalesSummaryData, 
    ForecastData, 
    SegmentData, // Using SegmentData which wraps CustomerSegment[]
    PerformanceData 
} from '@/types/analytics';

// Helper component for loading state
const LoadingIndicator = ({ message = "Loading data..." }: { message?: string }) => (
    <div className="flex items-center justify-center h-full py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>{message}</span>
    </div>
);

// Helper component for error state
const ErrorDisplay = ({ error }: { error: string | null }) => (
    <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "An unexpected error occurred."}</AlertDescription>
    </Alert>
);


const AnalyticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState('last-30-days');

    const [summaryData, setSummaryData] = useState<SalesSummaryData | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [forecastLoading, setForecastLoading] = useState(true);
    const [forecastError, setForecastError] = useState<string | null>(null);

    const [segmentsData, setSegmentsData] = useState<SegmentData | null>(null);
    const [segmentsLoading, setSegmentsLoading] = useState(true);
    const [segmentsError, setSegmentsError] = useState<string | null>(null);

    const [productData, setProductData] = useState<PerformanceData | null>(null);
    const [productLoading, setProductLoading] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    
    // Map timeRange to backend-compatible period string if needed
    const mapTimeRangeToPeriod = (range: string): string => {
        const mapping: { [key: string]: string } = {
            'last-7-days': '7d',
            'last-30-days': '30d',
            'last-90-days': '90d',
            'last-12-months': '365d', // Assuming '12m' or '1y' if backend supports
            'all-time': 'all', // Or a very large number of days
        };
        return mapping[range] || '30d'; // Default to 30d
    };
    
    // Fetch summary data
    useEffect(() => {
        const fetchSummary = async () => {
            setSummaryLoading(true);
            setSummaryError(null);
            try {
                const period = mapTimeRangeToPeriod(timeRange);
                const apiResponse = await salesApi.getSummary(period); // Renamed to apiResponse for clarity
                
                // Updated mapping based on the "summary received" structure provided by user
                 setSummaryData({
                    totalRevenue: apiResponse.total_revenue || 0,
                    totalOrders: apiResponse.order_count || 0,
                    activeCustomers: 0, // Not available in the provided summary structure
                    avgOrderValue: apiResponse.average_order_value || 0,
                    revenueChange: apiResponse.period_growth ? `${apiResponse.period_growth >= 0 ? '+' : ''}${apiResponse.period_growth.toFixed(1)}%` : undefined,
                    // Other change values are not directly available from 'period_growth'
                    ordersChange: undefined, 
                    customersChange: undefined,
                    avgOrderValueChange: undefined
                });
            } catch (error) {
                setSummaryError(error instanceof Error ? error.message : String(error));
                setSummaryData(null); // Ensure data is null on error
            } finally {
                setSummaryLoading(false);
            }
        };
        fetchSummary();
    }, [timeRange]);

    // Fetch forecast data
    useEffect(() => {
        const fetchForecast = async () => {
            setForecastLoading(true);
            setForecastError(null);
            try {
                // The API takes periods and time_unit. mapTimeRangeToPeriod gives '30d' etc.
                // Let's parse periods and unit from timeRange or use defaults.
                const periods = 30;
                const unit = 'D';

                const data = await salesApi.getForecast(periods, unit);
                setForecastData(data); // Assuming backend returns { forecast: ForecastData }
            } catch (error) {
                setForecastError(error instanceof Error ? error.message : String(error));
                setForecastData(null); // Ensure data is null on error
            } finally {
                setForecastLoading(false);
            }
        };
        fetchForecast();
    }, [timeRange]); // Re-fetch if timeRange changes

    // Fetch customer segments
    useEffect(() => {
        const fetchSegments = async () => {
            setSegmentsLoading(true);
            setSegmentsError(null);
            try {
                // The API `customersApi.getSegments()` returns the structure compatible with `SegmentData` directly
                // as per user's example: { segments: [...], total_customers: ... }
                const data: SegmentData = await customersApi.getSegments(); 
                setSegmentsData(data); 
            } catch (error) {
                setSegmentsError(error instanceof Error ? error.message : String(error));
                setSegmentsData(null); 
            } finally {
                setSegmentsLoading(false);
            }
        };
        fetchSegments();
    }, []);

    // Fetch product performance
    useEffect(() => {
        const fetchProductPerformance = async () => {
            setProductLoading(true);
            setProductError(null);
            try {
                const period = mapTimeRangeToPeriod(timeRange);
                // productsApi.getPerformance mock takes time_period and limit
                const data = await productsApi.getPerformance(period, 10);
                setProductData(data); // Assuming backend returns { products: ProductPerformanceData[] }
            } catch (error) {
                setProductError(error instanceof Error ? error.message : String(error));
                setProductData(null); // Ensure data is null on error
            } finally {
                setProductLoading(false);
            }
        };
        fetchProductPerformance();
    }, [timeRange]);


    // Animation variants (unchanged from original)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } }
    };

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined) return '$0.00';
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };
    
    const formatNumber = (value: number | undefined) => {
        if (value === undefined) return '0';
        return value.toLocaleString('en-IN');
    };

    return (
        <PageLayout>
            <motion.div
                className="grid gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
                    <motion.div variants={itemVariants}>
                        <h1 className="text-3xl font-bold tracking-tight">Report Summary</h1>
                        <p className="text-muted-foreground">
                            Analyze your e-commerce sales and customer behavior
                        </p>
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Select value={timeRange} onValueChange={setTimeRange} >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                                <SelectItem value="last-12-months">Last 12 months</SelectItem>
                                <SelectItem value="all-time">All time</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Export Report</Button>
                    </motion.div>
                </div>

                {/* Dashboard Overview Cards */}
                <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
                    {summaryLoading ? (
                        <div className="md:col-span-2 lg:col-span-4"><LoadingIndicator message="Loading summary..."/></div>
                    ) : summaryError ? (
                         <div className="md:col-span-2 lg:col-span-4"><ErrorDisplay error={summaryError} /></div>
                    ) : summaryData ? (
                        <>
                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(summaryData.totalRevenue)}</div>
                                        {summaryData.revenueChange && <p className={`text-xs ${summaryData.revenueChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{summaryData.revenueChange} from last month</p>}
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Orders</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatNumber(summaryData.totalOrders)}</div>
                                        {summaryData.ordersChange && <p className={`text-xs ${summaryData.ordersChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{summaryData.ordersChange} from last month</p>}
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Customers</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatNumber(summaryData.activeCustomers)}</div>
                                        {summaryData.customersChange && <p className={`text-xs ${summaryData.customersChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{summaryData.customersChange} from last month</p>}
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(summaryData.avgOrderValue)}</div>
                                        {summaryData.avgOrderValueChange && <p className={`text-xs ${summaryData.avgOrderValueChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{summaryData.avgOrderValueChange} from last month</p>}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>
                    ) : null}
                </motion.div>

                {/* Dashboard Tabs */}
                <motion.div className="grid gap-6" variants={itemVariants}>
                    <Tabs defaultValue="sales-forecast" className="w-full">
                        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
                            <TabsTrigger value="sales-forecast">Sales Forecast</TabsTrigger>
                            <TabsTrigger value="customer-segments">Customer Segments</TabsTrigger>
                            <TabsTrigger value="product-performance">Product Performance</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sales-forecast" className="p-4 border rounded-md mt-2">
                            {forecastLoading ? <LoadingIndicator message="Loading forecast..."/> : forecastError ? <ErrorDisplay error={forecastError} /> : forecastData ? <SalesChart data={forecastData} /> : <p>No forecast data available.</p>}
                        </TabsContent>

                        <TabsContent value="customer-segments" className="p-4 border rounded-md mt-2">
                             {segmentsLoading ? <LoadingIndicator message="Loading segments..."/> : segmentsError ? <ErrorDisplay error={segmentsError} /> : segmentsData ? <CustomerSegments data={segmentsData} /> : <p>No customer segment data available.</p>}
                        </TabsContent>

                        <TabsContent value="product-performance" className="p-4 border rounded-md mt-2">
                            {productLoading ? <LoadingIndicator message="Loading products..."/> : productError ? <ErrorDisplay error={productError} /> : productData ? <ProductPerformance data={productData} /> : <p>No product performance data available.</p>}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </motion.div>
        </PageLayout>
    );
};

export default AnalyticsPage;