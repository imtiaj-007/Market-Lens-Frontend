'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { SegmentData } from '@/types/analytics';
import { EChartsOption, BarSeriesOption } from 'echarts';

interface RfmBarChartProps {
    data: SegmentData | null;
    isDarkMode: boolean;
}

const RfmBarChart: React.FC<RfmBarChartProps> = ({ data, isDarkMode }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const getThemeColors = () => {
        if (typeof window === 'undefined') {
            return {
                textColor: '#000',
                titleColor: '#000',
                axisLineColor: 'rgba(0, 0, 0, 0.2)',
                legendTextColor: '#333',
                chartColors: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE']
            };
        }
        const root = document.documentElement;
        const style = getComputedStyle(root);
        return {
            textColor: style.getPropertyValue('--color-foreground').trim() || (isDarkMode ? '#FFF' : '#000'),
            titleColor: style.getPropertyValue('--color-foreground').trim() || (isDarkMode ? '#FFF' : '#000'),
            axisLineColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            legendTextColor: style.getPropertyValue('--color-muted-foreground').trim() || (isDarkMode ? '#AAA' : '#333'),
            chartColors: [
                style.getPropertyValue('--color-chart-1').trim() || '#5470C6',
                style.getPropertyValue('--color-chart-2').trim() || '#91CC75',
                style.getPropertyValue('--color-chart-3').trim() || '#FAC858',
                style.getPropertyValue('--color-chart-4').trim() || '#EE6666',
                style.getPropertyValue('--color-chart-5').trim() || '#73C0DE',
            ],
        };
    };


    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstanceRef.current) {
            chartInstanceRef.current = echarts.init(chartRef.current);
        }
        const chart = chartInstanceRef.current;
        const themeColors = getThemeColors();

        if (!data || !data.segments || data.segments.length === 0) {
            chart.clear();
            return;
        }

        const segments = data.segments;
        const rfmDimensions = ['Recency', 'Frequency', 'Monetary'];

        const seriesData: BarSeriesOption[] = segments.map((segment, index) => ({
            name: segment.name,
            type: 'bar',
            barGap: '0%',
            emphasis: {
                focus: 'series',
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.3)',
                    opacity: 0.9
                }
            },
            data: [
                segment.rfm_avg.recency,
                segment.rfm_avg.frequency,
                segment.rfm_avg.monetary
            ],
            itemStyle: {
                color: segment.color || themeColors.chartColors[index % themeColors.chartColors.length]
            }
        }));

        const option: EChartsOption = {
            backgroundColor: 'transparent',
            title: {
                text: 'RFM Comparison by Segment (Bar Chart)',
                left: 'center',
                top: 0,
                textStyle: {
                    fontSize: 16,
                    color: themeColors.titleColor,
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: {
                    color: themeColors.textColor
                },
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: themeColors.axisLineColor
            },
            legend: {
                data: segments.map(s => s.name),
                bottom: 10,
                textStyle: {
                    color: themeColors.legendTextColor,
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: rfmDimensions,
                axisLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor
                    }
                },
                axisLabel: {
                    color: themeColors.textColor
                }
            },
            yAxis: {
                type: 'value',
                name: 'RFM Score',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: themeColors.axisLineColor
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor
                    }
                },
                axisLabel: {
                    color: themeColors.textColor
                }
            },
            series: seriesData
        };

        chart.setOption(option, true);

        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartRef.current);

        const handleWindowResize = () => chart.resize();
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            if (chartRef.current) {
                 resizeObserver.unobserve(chartRef.current);
            }
        };
    }, [data, isDarkMode]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default RfmBarChart; 