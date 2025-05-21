import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { SalesSummary } from '@/lib/types/api';
import { Loader2, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export function SalesSummaryWidget({ period = '30d' }: { period?: '7d' | '30d' | '90d' | '12m' }) {
  const [salesData, setSalesData] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getSalesSummary({ period });
        setSalesData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sales summary:', err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesSummary();
  }, [period]);

  if (loading) {
    return (
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
          <CardDescription>Loading sales data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${salesData?.total_revenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {period === '7d' ? 'Past week' : period === '30d' ? 'Past month' : period === '90d' ? 'Past quarter' : 'Past year'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesData?.order_count.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {period === '7d' ? 'Past week' : period === '30d' ? 'Past month' : period === '90d' ? 'Past quarter' : 'Past year'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Order</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${salesData?.average_order_value.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Per order average
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Growth</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={`${salesData?.period_growth && salesData.period_growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {salesData?.period_growth && salesData.period_growth > 0 ? '+' : ''}{salesData?.period_growth}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Compared to previous period
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Products with highest revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData?.top_products.map((product, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.quantity} units sold
                  </p>
                </div>
                <div className="text-sm font-medium">${product.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 