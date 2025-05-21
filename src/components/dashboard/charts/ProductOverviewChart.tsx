import { PerformanceData } from '@/types/analytics';
import BaseBarChart from '@/components/charts/BaseBarChart';
import type { BarSeriesOption } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { getThemeColors, AxisLabelFormatterParams } from '@/lib/chartUtils';


interface ProductOverviewChartProps {
    data: PerformanceData['products'];
    isDarkMode: boolean;
    isClient: boolean;
}

const ProductOverviewChart: React.FC<ProductOverviewChartProps> = ({ data, isDarkMode, isClient }) => {
    const themeColors = getThemeColors(isDarkMode);

    if (!isClient || !data || data.length === 0) {
        return <div style={{ width: '100%', height: '320px' }} className="flex items-center justify-center text-gray-500 dark:text-gray-400">Loading product data...</div>;
    }

    const topProducts = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const series: BarSeriesOption[] = [
        {
            name: 'Revenue',
            type: 'bar', // BaseBarChart sets type, but explicit is fine
            data: topProducts.map(p => ({
                value: p.revenue,
                name: p.name,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: themeColors.primary },
                        { offset: 1, color: themeColors.accent } // Using accent for gradient
                    ])
                }
            })),
            barWidth: '60%', // This can be passed via additionalOptions or directly if BaseBarChart supports it
        }
    ];

    const tooltipFormatter = (params: any | any[]) => {
        const pArray = Array.isArray(params) ? params : [params];
        const p = pArray[0]; // Assuming single series or focus on the first
        const productName = typeof p.name === 'string' ? p.name : '';
        if (!productName) return '';
        
        const product = data.find(prod => prod.name === productName);
        if (!product) return '';

        return `<div style="font-weight:bold; margin-bottom: 5px;">${product.name}</div>
                <div>Revenue: $${product.revenue.toLocaleString()}</div>
                <div>Units Sold: ${product.quantity.toLocaleString()}</div>
                <div>Avg Price: $${product.avg_price.toFixed(2)}</div>
                <div>Growth: ${product.growth > 0 ? '+' : ''}${product.growth}%</div>`;
    };

    const xAxisLabelFormatter = (value: AxisLabelFormatterParams) => `$${(Number(value) / 1000).toFixed(0)}K`;
    
    const yAxisLabelFormatter = (value: AxisLabelFormatterParams) => {
        const strValue = String(value);
        return strValue.length > 15 ? strValue.slice(0, 13) + '...' : strValue;
    };

    const barLabelFormatter = (params: any) => {
        const val = params.value as number;
        return `$${(val / 1000).toFixed(1)}K`;
    };

    return (
        <BaseBarChart 
            titleText="Top 5 Products by Revenue"
            series={series}
            // For horizontal bar chart: provide yAxisData (categories) and define xAxis as value.
            yAxisData={topProducts.map(p => p.name)} // Categories on Y-axis
            xAxisName="Revenue ($)" // Value axis name
            isDarkMode={isDarkMode}
            isClient={isClient}
            height="320px"
            tooltipFormatter={tooltipFormatter}
            xAxisLabelFormatter={xAxisLabelFormatter}
            yAxisLabelFormatter={yAxisLabelFormatter}
            barLabelFormatter={barLabelFormatter}
            additionalOptions={{
                grid: {
                    top: 40,
                    bottom: 30, // Adjusted for axis name
                    left: 100, // Space for long Y-axis labels
                    right: 60, // Space for bar labels
                },
                // series-specific options like barWidth can also be in additionalOptions.series if not on base series prop
                // Forcing barLabelFormatter to use specific text color from theme if BaseBarChart doesn't handle it by default
                // series: series.map(s => ({ ...s, label: { ...s.label, color: themeColors.chartTextColor } })) 
                // This ^ is tricky, BaseBarChart should ideally handle label color via its theme logic or props.
                // If BaseBarChart's barLabelFormatter prop implies enabling labels, then we only pass the formatter fn.
            }}
        />
    );
};

export default ProductOverviewChart; 