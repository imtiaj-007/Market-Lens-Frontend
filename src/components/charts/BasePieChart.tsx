import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import type { PieSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getThemeColors } from '@/lib/chartUtils';

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer
]);

// Define a more specific type for pie chart data items
export interface BasePieChartDataItem {
    name: string;
    value: number;
    itemStyle?: PieSeriesOption['itemStyle'];
    // PieDataItemOption can also have `groupId`, `selected`, `label`, `labelLine`, `upperLabel`, `emphasis`, `select`, `blur`, `stateAnimation`
    // For a base component, name, value, and optional itemStyle are usually sufficient.
}

export interface BasePieChartProps {
    titleText: string;
    seriesName: string;
    seriesData: BasePieChartDataItem[]; 
    isDarkMode: boolean;
    isClient: boolean;
    height?: string;
    additionalOptions?: echarts.EChartsCoreOption;
    tooltipFormatter?: (params: any) => string; // Keeping 'any' for now
    legendFormatter?: (name: string) => string;
}

const BasePieChart: React.FC<BasePieChartProps> = ({
    titleText,
    seriesName,
    seriesData,
    isDarkMode,
    isClient,
    height = '320px',
    additionalOptions,
    tooltipFormatter,
    legendFormatter
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!isClient || !chartRef.current || !seriesData || seriesData.length === 0) {
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

        const defaultSeriesOptions: PieSeriesOption = {
            name: seriesName,
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 10,
                borderColor: themeColors.pieBorderColor,
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center',
                color: themeColors.chartTextColor
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: themeColors.chartTextColor
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            },
            color: themeColors.categoryColors,
            data: seriesData.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: item.itemStyle
            }))
        };

        const defaultOptions: echarts.EChartsCoreOption = {
            backgroundColor: themeColors.chartBackgroundColor,
            title: {
                text: titleText,
                left: 'center',
                top: 10,
                textStyle: { fontSize: 16, fontWeight: 'bold', color: themeColors.chartTextColor }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: themeColors.tooltipBackgroundColor,
                borderColor: themeColors.tooltipBorderColor,
                textStyle: { color: themeColors.tooltipTextColor },
                formatter: tooltipFormatter
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'middle',
                itemWidth: 12,
                itemHeight: 12,
                icon: 'circle',
                textStyle: { color: themeColors.chartSubTextColor },
                formatter: legendFormatter,
                data: seriesData.map(item => item.name) // Now item.name is guaranteed by BasePieChartDataItem
            },
            series: [defaultSeriesOptions]
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
        seriesData, 
        seriesName,
        isDarkMode, 
        isClient, 
        chartInstance, 
        titleText, 
        additionalOptions, 
        tooltipFormatter, 
        legendFormatter,
        height
    ]);

    return <div ref={chartRef} style={{ width: '100%', height, visibility: isClient ? 'visible' : 'hidden' }} />;
};

export default BasePieChart; 