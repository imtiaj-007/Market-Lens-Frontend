import { PerformanceData } from '@/types/analytics';
import { getThemeColors, AxisLabelFormatterParams } from '../../../lib/chartUtils'; 
import BaseScatterChart from '@/components/charts/BaseScatterChart';
import type { ScatterSeriesOption } from 'echarts/charts';
import type { EChartsCoreOption } from 'echarts/core';

// Define a local interface for the data items we construct for this specific chart
interface RevenueGrowthChartDataItem {
    name: string;
    value: [number, number];
    symbolSize: number;
    itemStyle?: ScatterSeriesOption['itemStyle']; // Use itemStyle from ScatterSeriesOption, make it optional
}

interface RevenueGrowthChartProps {
    data: PerformanceData['products']; 
    isDarkMode: boolean;
    isClient: boolean;
}

const RevenueGrowthChart: React.FC<RevenueGrowthChartProps> = ({ data, isDarkMode, isClient }) => {
    const themeColors = getThemeColors(isDarkMode);

    if (!isClient || !data || data.length === 0) {
        return <div style={{ width: '100%', height: '320px' }} className="flex items-center justify-center text-gray-500 dark:text-gray-400">Loading revenue/growth data...</div>;
    }

    const chartDataItems: RevenueGrowthChartDataItem[] = data.map(product => ({
        name: product.name, 
        value: [product.revenue, product.growth],
        symbolSize: Math.max(Math.sqrt(product.quantity) / 2 + 5, 8), 
        itemStyle: {
            color: product.growth >= 0 ? themeColors.positive : themeColors.negative,
            opacity: 0.75
        } as ScatterSeriesOption['itemStyle'] // Assert the constructed object type
    }));

    const scatterSeries: ScatterSeriesOption[] = [
        {
            type: 'scatter',
            name: 'Products', 
            data: chartDataItems as ScatterSeriesOption['data'], // Assert that our specific structure is compatible
            emphasis: {
                focus: 'series',
                itemStyle: {
                    opacity: 1,
                    borderColor: themeColors.pieBorderColor, 
                    borderWidth: 2
                }
            }
        }
    ];

    const tooltipFormatter = (params: any) => {
        // params.data here will be an item from chartDataItems
        const item = params.data as RevenueGrowthChartDataItem;
        if (!item || !item.name) return '';
        
        // Find the full product from the original data prop for all details
        const product = data.find(p => p.name === item.name);
        if (!product) return ''; // Should not happen if item.name is from product.name

        return `<div style="font-weight:bold; margin-bottom: 5px;">${product.name}</div>
                <div>Revenue: $${product.revenue.toLocaleString()}</div>
                <div>Growth: ${product.growth > 0 ? '+' : ''}${product.growth}%</div>
                <div>Units Sold: ${product.quantity.toLocaleString()}</div>`;
    };

    const xAxisLabelFormatter = (value: AxisLabelFormatterParams) => `$${(Number(value) / 1000).toFixed(0)}K`;
    const yAxisLabelFormatter = (value: AxisLabelFormatterParams) => `${Number(value).toFixed(0)}%`;

    const additionalOptions: EChartsCoreOption = {
        series: [
            {
                type: 'line', 
                name: 'Growth Threshold Line',
                silent: true,
                data: [], 
                markLine: {
                    symbol: ['none', 'none'],
                    lineStyle: {
                        color: themeColors.neutral, 
                        type: 'dashed'
                    },
                    data: [
                        {
                            yAxis: 0,
                            label: {
                                formatter: 'Zero Growth',
                                position: 'middle', 
                                color: themeColors.chartSubTextColor,
                                fontSize: 10
                            }
                        }
                    ]
                }
            }
        ]
    };

    return (
        <BaseScatterChart 
            titleText="Revenue vs Growth Analysis"
            series={scatterSeries} 
            xAxisName="Revenue ($)"
            yAxisName="Growth (%)"
            isDarkMode={isDarkMode}
            isClient={isClient}
            height="320px"
            tooltipFormatter={tooltipFormatter}
            xAxisLabelFormatter={xAxisLabelFormatter}
            yAxisLabelFormatter={yAxisLabelFormatter}
            additionalOptions={additionalOptions}
        />
    );
};

export default RevenueGrowthChart; 