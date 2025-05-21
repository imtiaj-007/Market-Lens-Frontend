import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import type { ScatterSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getThemeColors, AxisLabelFormatterParams } from '@/lib/chartUtils';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ScatterChart,
    CanvasRenderer,
    VisualMapComponent
]);

export interface BaseScatterChartProps {
    titleText: string;
    series: ScatterSeriesOption[]; 
    xAxisName?: string;
    yAxisName?: string;
    isDarkMode: boolean;
    isClient: boolean;
    height?: string;
    additionalOptions?: echarts.EChartsCoreOption;
    tooltipFormatter?: (params: any) => string; 
    xAxisLabelFormatter?: (value: AxisLabelFormatterParams) => string;
    yAxisLabelFormatter?: (value: AxisLabelFormatterParams) => string;
    legendData?: string[];
    visualMap?: echarts.EChartsCoreOption['visualMap']; 
}

const BaseScatterChart: React.FC<BaseScatterChartProps> = ({
    titleText,
    series,
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
    visualMap
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
                trigger: 'item', 
                axisPointer: { type: 'cross' },
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
                right: visualMap ? 80 : 40, 
                containLabel: true
            },
            xAxis: {
                type: 'value', 
                name: xAxisName,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { color: themeColors.chartSubTextColor },
                axisLabel: {
                    formatter: xAxisLabelFormatter,
                    color: themeColors.chartSubTextColor
                },
                axisLine: { lineStyle: { color: themeColors.chartAxisLineColor } },
                splitLine: { lineStyle: { type:'dashed', color: themeColors.chartSplitLineColor} }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameLocation: 'middle',
                nameGap: 45, 
                nameTextStyle: { color: themeColors.chartSubTextColor }, 
                axisLabel: {
                    formatter: yAxisLabelFormatter,
                    color: themeColors.chartSubTextColor
                },
                axisLine: { show:true, lineStyle: { color: themeColors.chartAxisLineColor } },
                splitLine: { lineStyle: { type:'dashed', color: themeColors.chartSplitLineColor} }
            },
            series: series.map((s, index) => ({
                type: 'scatter',
                symbolSize: 10, 
                itemStyle: {
                    color: s.color || themeColors.categoryColors[index % themeColors.categoryColors.length]
                },
                ...s
            })),
            visualMap: visualMap 
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
        xAxisName, yAxisName,
        isDarkMode, isClient, chartInstance, 
        titleText, additionalOptions, tooltipFormatter, 
        xAxisLabelFormatter, yAxisLabelFormatter, legendData,
        visualMap,
        height
    ]);

    return <div ref={chartRef} style={{ width: '100%', height, visibility: isClient ? 'visible' : 'hidden' }} />;
};

export default BaseScatterChart;
