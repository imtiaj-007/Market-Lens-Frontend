'use client';

import { useEffect, useState } from 'react';
import { PerformanceData } from '@/types/analytics';
import ProductOverviewChart from './charts/ProductOverviewChart';
import CategoryOverviewChart from './charts/CategoryOverviewChart';
import RevenueGrowthChart from './charts/RevenueGrowthChart';
import TrendChart from './charts/TrendChart';
import { AlertCircle, Inbox, TrendingUp, TrendingDown } from 'lucide-react';

interface ProductPerformanceProps {
    data: PerformanceData | null;
    isLoading?: boolean;
    error?: Error | null;
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({ data, isLoading = false, error = null }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const checkDarkMode = () => {
            if (typeof window !== 'undefined') {
                const isDark = document.documentElement.classList.contains('dark');
                setIsDarkMode(isDark);
            }
        };
        checkDarkMode();
        if (typeof window !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.attributeName === 'class' &&
                        mutation.target === document.documentElement
                    ) {
                        checkDarkMode();
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true });
            return () => observer.disconnect();
        }
    }, []);


    const ErrorState = ({ message }: { message?: string }) => (
        <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Error Loading Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{message || "An error occurred while loading performance data."}</p>
            </div>
        </div>
    );

    const LoadingState = () => (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[320px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-gray-400 dark:border-t-gray-500 animate-spin"></div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg animate-pulse">
                    <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                                <div className="h-8 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
                <Inbox className="w-16 h-16 text-blue-300 dark:text-blue-500 mx-auto mb-3" strokeWidth={1} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">No Data Available</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">There is no performance data to display at this time.</p>
            </div>
        </div>
    );

    const PerformanceSummary = () => {
        if (!data) return null;
        const avgGrowth = data.products.length > 0 ? data.products.reduce((sum, p) => sum + p.growth, 0) / data.products.length : 0;
        const totalUnits = data.products.reduce((sum, p) => sum + p.quantity, 0);
        const avgPrice = totalUnits > 0 ? data.products.reduce((sum, p) => sum + (p.avg_price * p.quantity), 0) / totalUnits : 0;

        return (
            <div className="mt-6">
                <div className="p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Performance Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${(data.total_revenue || 0).toLocaleString()}</p>
                            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                {data.products?.[0]?.name && `Top: ${data.products[0].name}`}
                            </div>
                        </div>
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Products</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{data.total_products || 0}</p>
                            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                {data.categories?.[0]?.name && `Leading: ${data.categories[0].name}`}
                            </div>
                        </div>
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Avg. Price</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${avgPrice.toFixed(2)}</p>
                            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                {data.products?.length > 0 &&
                                    `Range: ${Math.min(...data.products.map(p => p.avg_price)).toFixed(2)} - ${Math.max(...data.products.map(p => p.avg_price)).toFixed(2)}`}
                            </div>
                        </div>
                        <div className="bg-card p-4 rounded-lg shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Avg. Growth</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}%</p>
                                {avgGrowth > 0 ? (
                                    <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400 ml-2" strokeWidth={2} />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400 ml-2" strokeWidth={2} />
                                )}
                            </div>
                            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                {data.products?.length > 0 &&
                                    `Highest: ${data.products.reduce((max, p) => p.growth > max.growth ? p : max, data.products[0]).name} (${data.products.reduce((max, p) => p.growth > max.growth ? p : max, data.products[0]).growth}%)`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return <ErrorState message={error.message} />;
    }
    if (isLoading) {
        return <LoadingState />;
    }
    if (!data) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
                    <ProductOverviewChart data={data.products} isDarkMode={isDarkMode} isClient={isClient} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
                    <CategoryOverviewChart data={data.categories} isDarkMode={isDarkMode} isClient={isClient} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
                    <RevenueGrowthChart data={data.products} isDarkMode={isDarkMode} isClient={isClient} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
                    <TrendChart productsData={data.products} isDarkMode={isDarkMode} isClient={isClient} />
                </div>
            </div>
            <PerformanceSummary />
        </div>
    );
};

export default ProductPerformance;