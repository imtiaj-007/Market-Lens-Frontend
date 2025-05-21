import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import type { LineSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getThemeColors, AxisLabelFormatterParams } from '@/lib/chartUtils';

// Register necessary ECharts components
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    MarkLineComponent
]);

export interface BaseLineChartProps {
    titleText: string;
    series: LineSeriesOption[];
    xAxisData: string[] | number[];
    yAxisName?: string;
    isDarkMode: boolean;
    isClient: boolean;
    height?: string;
    additionalOptions?: echarts.EChartsCoreOption;
    tooltipFormatter?: (params: any | any[]) => string;
    yAxisLabelFormatter?: (value: AxisLabelFormatterParams) => string;
    legendData?: string[];
}

const BaseLineChart: React.FC<BaseLineChartProps> = ({
    titleText,
    series,
    xAxisData,
    yAxisName,
    isDarkMode,
    isClient,
    height = '320px',
    additionalOptions,
    tooltipFormatter,
    yAxisLabelFormatter,
    legendData
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

        const defaultOptions: echarts.EChartsCoreOption = {
            backgroundColor: themeColors.chartBackgroundColor,
            title: {
                text: titleText,
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'bold', color: themeColors.chartTextColor }
            },
            tooltip: {
                trigger: 'axis',
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
                top: legendData && legendData.length > 0 ? 60 : 50,
                bottom: 50,
                left: 60,
                right: 40
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                boundaryGap: false,
                axisLabel: { color: themeColors.chartSubTextColor },
                axisLine: { lineStyle: { color: themeColors.chartAxisLineColor } }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: { color: themeColors.chartSubTextColor, padding: [0, 0, 0, 50] },
                axisLabel: {
                    formatter: yAxisLabelFormatter || (() => `\${String(value)}`),
                    color: themeColors.chartSubTextColor
                },
                axisLine: { show: true, lineStyle: { color: themeColors.chartAxisLineColor } },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: themeColors.chartSplitLineColor
                    }
                }
            },
            series: series.map(s => ({
                type: 'line',
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 2 },
                itemStyle: { },
                areaStyle: {
                    opacity: 0.1
                },
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
        xAxisData, 
        isDarkMode, 
        isClient, 
        chartInstance, 
        titleText, 
        yAxisName, 
        additionalOptions, 
        tooltipFormatter, 
        yAxisLabelFormatter,
        legendData,
        height
    ]);

    return <div ref={chartRef} style={{ width: '100%', height, visibility: isClient ? 'visible' : 'hidden' }} />;
};

export default BaseLineChart; 