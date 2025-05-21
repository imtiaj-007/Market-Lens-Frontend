import { PerformanceData } from '@/types/analytics';
import { getThemeColors, AxisLabelFormatterParams } from '../../../lib/chartUtils'; 
import BaseLineChart from '@/components/charts/BaseLineChart'; 
import type { LineSeriesOption } from 'echarts/charts';
import * as echarts from 'echarts/core'; // Added for echarts.graphic and echarts.color

interface TrendChartProps {
    productsData: PerformanceData['products'];
    isDarkMode: boolean;
    isClient: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({ productsData, isDarkMode, isClient }) => {
    const themeColors = getThemeColors(isDarkMode);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const topProducts = [...productsData].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

    const simulatedSeries: LineSeriesOption[] = topProducts.map((product, index) => {
        const finalRevenue = product.revenue;
        const initialRevenue = product.growth !== 0 ? finalRevenue / (1 + product.growth / 100) : finalRevenue;
        const numPeriods = months.length;
        let periodGrowthFactor = 1;

        if (initialRevenue > 0 && finalRevenue > 0 && initialRevenue !== finalRevenue) {
            periodGrowthFactor = Math.pow(finalRevenue / initialRevenue, 1 / numPeriods);
        } else if (initialRevenue === 0 && finalRevenue > 0) {
            periodGrowthFactor = Math.pow(finalRevenue / 1, 1 / numPeriods); 
        }

        const trendLineData: number[] = [];
        // Ensure currentSimulatedRevenue starts at a non-zero positive if possible to avoid Math.pow with base 0 if growth is applied
        let currentSimulatedRevenue = initialRevenue > 0 ? initialRevenue : (finalRevenue > 0 ? 0.01 : 0) ; 
        
        for (let i = 0; i < numPeriods -1; i++) {
            trendLineData.push(Math.round(currentSimulatedRevenue));
            // Only apply growth if current revenue is positive, or if it's starting from near-zero and meant to grow
            if (currentSimulatedRevenue > 0 || (currentSimulatedRevenue === 0.01 && periodGrowthFactor > 1)) {
                 currentSimulatedRevenue *= periodGrowthFactor;
            }
            if (currentSimulatedRevenue < 0 && finalRevenue >=0) currentSimulatedRevenue = 0; 
        }
        trendLineData.push(Math.round(finalRevenue));

        return {
            name: product.name,
            type: 'line', 
            data: trendLineData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3 }, 
            itemStyle: { 
                color: [themeColors.primary, themeColors.accent, themeColors.highlight][index % 3]
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: echarts.color.modifyAlpha([themeColors.primary, themeColors.accent, themeColors.highlight][index % 3], 0.3) },
                    { offset: 1, color: echarts.color.modifyAlpha([themeColors.primary, themeColors.accent, themeColors.highlight][index % 3], 0.05) }
                ])
            }
        };
    });

    const tooltipFormatter = (params: any | any[]) => {
        const pArray = Array.isArray(params) ? params : [params];
        if (pArray.length === 0 || !pArray[0]?.axisValue) return '';
        let result = `<div style="font-weight:bold; margin-bottom: 5px;">${pArray[0].axisValue}</div>`;
        pArray.forEach((param: any) => {
            result += `<div style="display:flex; align-items:center; margin-bottom:3px;">
                        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${param.color};margin-right:5px;"></span>
                        <span>${param.seriesName}: $${param.value?.toLocaleString() || '0'}</span>
                      </div>`;
        });
        return result;
    };

    const yAxisLabelFormatter = (value: AxisLabelFormatterParams) => {
        const numValue = Number(value);
        if (numValue >= 1000000) return `$${(numValue / 1000000).toFixed(1)}M`;
        if (numValue >= 1000) return `$${(numValue / 1000).toFixed(0)}K`;
        return `$${numValue.toFixed(0)}`;
    };

    if (!isClient || !productsData || productsData.length === 0 || topProducts.length === 0) {
        return <div style={{ width: '100%', height: '320px' }} className="flex items-center justify-center text-gray-500 dark:text-gray-400">Loading trend data or no top products to display...</div>; 
    }

    return (
        <BaseLineChart 
            titleText="Revenue Trend (Last 6 Months)"
            series={simulatedSeries}
            xAxisData={months}
            yAxisName="Revenue ($)"
            isDarkMode={isDarkMode}
            isClient={isClient}
            height="320px"
            tooltipFormatter={tooltipFormatter}
            yAxisLabelFormatter={yAxisLabelFormatter}
            legendData={topProducts.map(p => p.name)}
            additionalOptions={{
                grid: {
                    left: '80px', 
                    right: '30px',
                    bottom: '40px',
                    top: topProducts.length > 0 ? 70 : 50 // Adjust top based on legend presence
                }
            }}
        />
    );
};

export default TrendChart;
