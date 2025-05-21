'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

import { SegmentData, CustomerSegment as Segment } from '@/types/analytics';
import { EChartsOption } from 'echarts';

interface RfmScatterPlot3DProps {
    data: SegmentData | null;
    isDarkMode: boolean;
}

interface Scatter3DDataItem {
    name: string;
    value: [number, number, number, number]; // R, F, M, Count
    itemStyle?: { color: string };
}

const RfmScatterPlot3D: React.FC<RfmScatterPlot3DProps> = ({ data, isDarkMode }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const getThemeColors = () => {
        if (typeof window === 'undefined') {
            return {
                textColor: '#000',
                titleColor: '#000',
                axisLineColor: 'rgba(0, 0, 0, 0.2)',
                visualMapColor: ['#bf444c', '#d88273', '#f6efa6'],
                chartColors: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'],
                backgroundColor: 'transparent'
            };
        }
        const root = document.documentElement;
        const style = getComputedStyle(root);
        return {
            textColor: style.getPropertyValue('--color-foreground').trim() || (isDarkMode ? '#FFF' : '#000'),
            titleColor: style.getPropertyValue('--color-foreground').trim() || (isDarkMode ? '#FFF' : '#000'),
            axisLineColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            visualMapColor: isDarkMode 
                ? ['#4A90E2', '#50E3C2', '#F8E71C'] 
                : ['#2F54EB', '#1890FF', '#BADCFF'],
            chartColors: [
                style.getPropertyValue('--color-chart-1').trim() || '#5470C6',
                style.getPropertyValue('--color-chart-2').trim() || '#91CC75',
                style.getPropertyValue('--color-chart-3').trim() || '#FAC858',
                style.getPropertyValue('--color-chart-4').trim() || '#EE6666',
                style.getPropertyValue('--color-chart-5').trim() || '#73C0DE',
            ],
            backgroundColor: isDarkMode ? 'rgba(20, 20, 20, 0.7)' : 'rgba(255, 255, 255, 0.7)'
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

        const scatterData: Scatter3DDataItem[] = data.segments.map((segment: Segment, index: number) => ({
            name: segment.name,
            value: [
                segment.rfm_avg.recency,
                segment.rfm_avg.frequency,
                segment.rfm_avg.monetary,
                segment.count
            ],
            itemStyle: {
                color: segment.color || themeColors.chartColors[index % themeColors.chartColors.length],
                opacity: 0.8
            }
        }));
        
        // Calculate dynamic sizes based on data range
        const maxCount = Math.max(...scatterData.map(d => d.value[3]));
        const minCount = Math.min(...scatterData.map(d => d.value[3]));
        const sizeRange = [15, 50]; // Base size range

        const seriesOpt: echarts.SeriesOption | any = {
            name: 'Customer Segments',
            type: 'scatter3D',
            data: scatterData,
            symbolSize: (val: number[]) => {
                // Scale size based on count relative to max count
                const normalizedSize = (val[3] - minCount) / (maxCount - minCount) || 0.5;
                return sizeRange[0] + normalizedSize * (sizeRange[1] - sizeRange[0]);
            },
            emphasis: {
                label: {
                    show: true,
                    formatter: (params: any) => { 
                        const scatterPoint = params.data as Scatter3DDataItem;
                        return `${scatterPoint.name}\nCount: ${scatterPoint.value[3]}`;
                    },
                    position: 'top',
                    color: themeColors.textColor,
                    fontSize: 12,
                    backgroundColor: themeColors.backgroundColor,
                    borderColor: themeColors.axisLineColor,
                    borderWidth: 1,
                    padding: [5, 8],
                    borderRadius: 4,
                    lineHeight: 18
                },
                itemStyle: {
                    borderWidth: 2,
                    borderColor: isDarkMode ? '#FFF' : '#000',
                    opacity: 1
                }
            },
            label: {
                show: true,
                formatter: (params: any) => {
                    return params.data.name;
                },
                position: 'right',
                color: themeColors.textColor,
                fontSize: 10,
                backgroundColor: themeColors.backgroundColor,
                padding: [2, 4],
                borderRadius: 2,
                distance: 10
            },
            itemStyle: {
                shadowBlur: 10,
                shadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
                shadowOffsetY: 5
            }
        };

        const option: EChartsOption = {
            backgroundColor: 'transparent',
            title: {
                text: 'RFM 3D Scatter Plot',
                subtext: 'Recency, Frequency, Monetary Value Analysis',
                left: 'center',
                top: 0,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: themeColors.titleColor
                },
                subtextStyle: {
                    fontSize: 14,
                    color: themeColors.textColor
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => { 
                    const scatterPoint = params.data as Scatter3DDataItem;
                    if (!scatterPoint || !scatterPoint.value) return '';
                    return `
                        <div style="font-weight:bold;margin-bottom:5px">${scatterPoint.name}</div>
                        <div>Recency: ${scatterPoint.value[0].toFixed(1)}</div>
                        <div>Frequency: ${scatterPoint.value[1].toFixed(1)}</div>
                        <div>Monetary: ${scatterPoint.value[2].toFixed(1)}</div>
                        <div style="margin-top:5px">Customers: ${scatterPoint.value[3]}</div>
                    `;
                },
                textStyle: {
                    color: themeColors.textColor,
                    fontSize: 12
                },
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: themeColors.axisLineColor,
                extraCssText: isDarkMode ? 'box-shadow: 0 0 10px rgba(255,255,255,0.2);' : 'box-shadow: 0 0 10px rgba(0,0,0,0.1);'
            },
            visualMap: {
                show: true,
                max: maxCount,
                min: minCount,
                dimension: 3,
                inRange: {
                    color: themeColors.visualMapColor,
                    symbolSize: sizeRange
                },
                right: 20,
                top: 'middle',
                calculable: true,
                textStyle: { 
                    color: themeColors.textColor,
                    fontSize: 12
                },
                formatter: (value: number) => {
                    return `${Math.round(value)} customers`;
                },
                inRangeText: ['High', 'Low'],
                textGap: 15,
                orient: 'vertical'
            },
            xAxis3D: {
                name: 'Recency',
                type: 'value',
                nameTextStyle: { 
                    color: themeColors.textColor,
                    fontSize: 12,
                    padding: [10, 0, 0, 0]
                },
                axisLine: { 
                    lineStyle: { 
                        color: themeColors.axisLineColor,
                        width: 2
                    } 
                },
                axisLabel: { 
                    color: themeColors.textColor,
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor,
                        opacity: 0.2
                    }
                },
                nameGap: 20
            },
            yAxis3D: {
                name: 'Frequency',
                type: 'value',
                nameTextStyle: { 
                    color: themeColors.textColor,
                    fontSize: 12,
                    padding: [0, 0, 10, 0]
                },
                axisLine: { 
                    lineStyle: { 
                        color: themeColors.axisLineColor,
                        width: 2
                    } 
                },
                axisLabel: { 
                    color: themeColors.textColor,
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor,
                        opacity: 0.2
                    }
                },
                nameGap: 20
            },
            zAxis3D: {
                name: 'Monetary',
                type: 'value',
                nameTextStyle: { 
                    color: themeColors.textColor,
                    fontSize: 12,
                    padding: [0, 0, 0, 10]
                },
                axisLine: { 
                    lineStyle: { 
                        color: themeColors.axisLineColor,
                        width: 2
                    } 
                },
                axisLabel: { 
                    color: themeColors.textColor,
                    fontSize: 11,
                    rotate: 0
                },
                splitLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor,
                        opacity: 0.2
                    }
                },
                nameGap: 20
            },
            grid3D: {
                axisPointer: {
                    show: true,
                    lineStyle: {
                        color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                        width: 1
                    }
                },
                viewControl: {
                    autoRotate: true,
                    autoRotateSpeed: 10,
                    distance: 150,
                    alpha: 40,
                    beta: 70,
                    rotateSensitivity: 1,
                    zoomSensitivity: 1,
                    panSensitivity: 1
                },
                boxWidth: 100,
                boxHeight: 100,
                boxDepth: 100,
                axisLine: {
                    lineStyle: {
                        color: themeColors.axisLineColor,
                        width: 2
                    }
                },
                light: {
                    main: {
                        intensity: 1.5,
                        shadow: true,
                        shadowQuality: 'high',
                        alpha: 30,
                        beta: 40
                    },
                    ambient: {
                        intensity: 0.7
                    }
                }
            },
            series: [seriesOpt]
        };

        chart.setOption(option as any, true);

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

    return <div ref={chartRef} style={{ width: '100%', height: '600px', minHeight: '500px' }} />;
};

export default RfmScatterPlot3D;