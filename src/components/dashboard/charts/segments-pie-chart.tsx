'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { SegmentData, CustomerSegment as Segment } from '@/types/analytics';
// import { EChartsFormatterParam } from '@/types/echarts'; // Removed unused import
import { EChartsOption } from 'echarts';

interface CustomerSegmentsPieChartProps {
    data: SegmentData | null;
    isDarkMode: boolean;
}

const CustomerSegmentsPieChart: React.FC<CustomerSegmentsPieChartProps> = ({ data, isDarkMode }) => {
    const pieChartRef = useRef<HTMLDivElement>(null);
    const pieChartInstanceRef = useRef<echarts.ECharts | null>(null);

    // Copied getThemeColors and adapted slightly, assuming it might be used by this component only
    const getThemeColors = () => {
        if (typeof window === 'undefined') { // Guard for SSR
            return {
                textColor: '#000',
                titleColor: '#000',
                backgroundColor: '#FFF',
                chartColors: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'],
                axisLineColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: '#DDD',
                legendTextColor: '#333'
            };
        }
        const root = document.documentElement;
        const style = getComputedStyle(root);
        return {
            textColor: style.getPropertyValue('--color-foreground').trim(),
            titleColor: style.getPropertyValue('--color-foreground').trim(),
            backgroundColor: style.getPropertyValue('--color-background').trim(),
            chartColors: [
                style.getPropertyValue('--color-chart-1').trim(),
                style.getPropertyValue('--color-chart-2').trim(),
                style.getPropertyValue('--color-chart-3').trim(),
                style.getPropertyValue('--color-chart-4').trim(),
                style.getPropertyValue('--color-chart-5').trim(),
            ],
            axisLineColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            borderColor: style.getPropertyValue('--color-border').trim(),
            legendTextColor: style.getPropertyValue('--color-muted-foreground').trim()
        };
    };

    const updatePieChart = () => {
        if (!pieChartRef.current || !pieChartInstanceRef.current) return;

        const chart = pieChartInstanceRef.current;
        if (!data || !data.segments || data.segments.length === 0) {
            chart.clear();
            return;
        }

        const themeColors = getThemeColors();
        const chartData = data.segments.map((segment: Segment, index: number) => ({
            value: segment.count,
            name: segment.name,
            itemStyle: {
                color: segment.color || themeColors.chartColors[index % themeColors.chartColors.length]
            }
        }));

        const pieOption: EChartsOption = {
            backgroundColor: 'transparent',
            title: {
                text: 'Customer Segments Distribution',
                left: 'center',
                top: 0,
                textStyle: {
                    fontSize: 16,
                    color: themeColors.titleColor
                }
            },
            tooltip: {
                trigger: 'item',
                // Restored semi-transparent background for tooltip
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: themeColors.borderColor,
                textStyle: {
                    color: themeColors.textColor
                },
                formatter: (params: any) => {
                    const currentSegmentData = params.data as { name: string; value: number; };
                    const originalSegment = data.segments.find(s => s.name === currentSegmentData.name);
                    if (originalSegment) {
                        return `
                            <div style="color: ${themeColors.textColor}">
                                <strong>${originalSegment.name}</strong> (${originalSegment.percentage}%)<br/>
                                Count: ${originalSegment.count}<br/>
                                <hr style="margin: 5px 0; border-color: ${themeColors.borderColor}"/>
                                <strong>RFM Averages:</strong><br/>
                                Recency: ${originalSegment.rfm_avg.recency.toFixed(1)}<br/>
                                Frequency: ${originalSegment.rfm_avg.frequency.toFixed(1)}<br/>
                                Monetary: ${originalSegment.rfm_avg.monetary.toFixed(1)}
                            </div>
                        `;
                    }
                    return `${params.seriesName || ''}<br/>${params.name || 'N/A'}: ${params.value || 'N/A'} (${params.percent || 0}%)`;
                }
            },
            legend: {
                orient: 'horizontal',
                bottom: 10,
                data: chartData.map(item => item.name),
                textStyle: {
                    color: themeColors.legendTextColor
                }
            },
            series: [
                {
                    name: 'Customer Segments',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: themeColors.backgroundColor, // Use background color for border to create a 'cutout' effect
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%',
                        color: themeColors.textColor
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold',
                            color: themeColors.textColor
                        },
                        itemStyle: {
                            // Make hovered segment more prominent
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            borderColor: themeColors.textColor, // Emphasize border
                            borderWidth: 2
                        }
                    },
                    labelLine: { show: true },
                    data: chartData
                }
            ]
        };
        pieChartInstanceRef.current.setOption(pieOption, true);
    };

    useEffect(() => {
        if (!pieChartRef.current) return;
        if (!pieChartInstanceRef.current) {
            pieChartInstanceRef.current = echarts.init(pieChartRef.current);
        }
        updatePieChart(); // Initial chart draw

        const resizeObserver = new ResizeObserver(() => pieChartInstanceRef.current?.resize());
        if(pieChartRef.current) resizeObserver.observe(pieChartRef.current);
        
        const handleWindowResize = () => pieChartInstanceRef.current?.resize();
        window.addEventListener('resize', handleWindowResize);
        
        return () => {
            window.removeEventListener('resize', handleWindowResize);
            if (pieChartRef.current) resizeObserver.unobserve(pieChartRef.current);
            // pieChartInstanceRef.current?.dispose(); // Optional: dispose chart on unmount
        };
    }, []); // Empty dependency array, will call updatePieChart which depends on [data, isDarkMode] via closure

    // Effect to update chart when data or theme changes
    useEffect(() => {
        if (pieChartInstanceRef.current) {
            updatePieChart();
        }
    }, [data, isDarkMode]);

    return <div ref={pieChartRef} style={{ width: '100%', height: '350px' }} />;
};

export default CustomerSegmentsPieChart; 