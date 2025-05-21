import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import type { BarSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getThemeColors, AxisLabelFormatterParams } from '@/lib/chartUtils';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer
]);

export interface BaseBarChartProps {
    titleText: string;
    series: BarSeriesOption[]; 
    xAxisData?: string[] | number[]; 
    yAxisData?: string[] | number[]; 
    xAxisName?: string;
    yAxisName?: string;
    isDarkMode: boolean;
    isClient: boolean;
    height?: string;
    additionalOptions?: echarts.EChartsCoreOption;
    tooltipFormatter?: (params: any | any[]) => string; 
    xAxisLabelFormatter?: (value: string | AxisLabelFormatterParams) => string;
    yAxisLabelFormatter?: (value: string | AxisLabelFormatterParams) => string;
    legendData?: string[];
    barLabelFormatter?: (params: any) => string; 
}

const BaseBarChart: React.FC<BaseBarChartProps> = ({
    titleText,
    series,
    xAxisData,
    yAxisData,
    xAxisName,
    yAxisName,
    isDarkMode,
    isClient,
    height = '320px',
    additionalOptions,
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    legendData,
    barLabelFormatter
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!isClient || !chartRef.current || !series || series.length === 0) {
            if (chartInstance) {
                chartInstance.dispose();
                setChartInstance(null);
            }
            return;
        }

        const themeColors = getThemeColors(isDarkMode);
        let currentChart = chartInstance;

        if (!currentChart) {
            currentChart = echarts.init(chartRef.current);
            setChartInstance(currentChart);
        }
        
        // Determine if it's a horizontal bar chart
        const isHorizontal = !!yAxisData && !xAxisData; 

        const defaultOptions: echarts.EChartsCoreOption = {
            backgroundColor: themeColors.chartBackgroundColor,
            title: {
                text: titleText,
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'bold', color: themeColors.chartTextColor }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: themeColors.tooltipBackgroundColor,
                borderColor: themeColors.tooltipBorderColor,
                textStyle: { color: themeColors.tooltipTextColor },
                formatter: tooltipFormatter
            },
            legend: legendData && legendData.length > 0 ? {
                data: legendData,
                top: 30,
                textStyle: { color: themeColors.chartSubTextColor }
            } : undefined,
            grid: {
                top: legendData && legendData.length > 0 ? 70 : 50,
                bottom: 50, 
                left: 60, 
                right: 40,
                containLabel: true 
            },
            xAxis: {
                type: isHorizontal ? 'value' : 'category',
                data: isHorizontal ? undefined : xAxisData,
                name: xAxisName,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { color: themeColors.chartSubTextColor },
                axisLabel: {
                    formatter: xAxisLabelFormatter,
                    color: themeColors.chartSubTextColor
                },
                axisLine: { lineStyle: { color: themeColors.chartAxisLineColor } },
                splitLine: { show: isHorizontal, lineStyle: { type:'dashed', color: themeColors.chartSplitLineColor} }
            },
            yAxis: {
                type: isHorizontal ? 'category' : 'value',
                data: isHorizontal ? yAxisData : undefined,
                name: yAxisName,
                nameLocation: 'middle',
                nameGap: isHorizontal && yAxisName ? (yAxisName.length * 6 + 20) : 45, // Dynamic gap for yAxis name in horizontal
                nameTextStyle: { color: themeColors.chartSubTextColor }, 
                axisLabel: {
                    formatter: yAxisLabelFormatter,
                    color: themeColors.chartSubTextColor
                },
                axisLine: { show:true, lineStyle: { color: themeColors.chartAxisLineColor } },
                splitLine: { show: !isHorizontal, lineStyle: { type:'dashed', color: themeColors.chartSplitLineColor} }
            },
            series: series.map((s, index) => ({
                type: 'bar',
                itemStyle: {
                    borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
                    color: Array.isArray(s.color) ? undefined : (s.color || themeColors.categoryColors[index % themeColors.categoryColors.length])
                },
                label: barLabelFormatter ? { 
                    show: true, 
                    position: isHorizontal ? 'right' : 'top', 
                    formatter: barLabelFormatter, 
                    color: themeColors.chartTextColor 
                } : undefined,
                color: Array.isArray(s.color) ? s.color : undefined, 
                ...s
            }))
        };
        
        const finalOptions = echarts.util.merge(defaultOptions, additionalOptions || {} as echarts.EChartsCoreOption) as echarts.EChartsCoreOption;
        currentChart.setOption(finalOptions);

        const handleWindowResize = () => {
            currentChart?.resize();
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [
        series, 
        xAxisData, yAxisData, 
        xAxisName, yAxisName,
        isDarkMode, isClient, chartInstance, 
        titleText, additionalOptions, tooltipFormatter, 
        xAxisLabelFormatter, yAxisLabelFormatter, legendData,
        barLabelFormatter,
        height
    ]);

    return <div ref={chartRef} style={{ width: '100%', height, visibility: isClient ? 'visible' : 'hidden' }} />;
};

export default BaseBarChart; 