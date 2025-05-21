'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ForecastData } from '@/types/analytics';

interface SalesChartProps {
    data: ForecastData | null;
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Initialize chart if it hasn't been initialized yet
        if (!chartInstanceRef.current) {
            chartInstanceRef.current = echarts.init(chartRef.current);
        }
        
        const chart = chartInstanceRef.current;

        if (!data || !data.dates || data.dates.length === 0) {
            chart.clear();
            return;
        }

        // Format dates to be more readable (e.g., "May 15")
        const formattedDates = data.dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const option = {
            title: {
                text: 'Sales Forecast',
                left: 'center',
                top: 0,
                textStyle: {
                    fontSize: 16,
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params: any) => {
                    const date = params[0].axisValue;
                    const value = params[0].data;
                    const upper = params[1].data;
                    const lower = params[2].data;
                    return `
                        <div style="font-weight:bold">${date}</div>
                        <div>Forecast: $${value?.toFixed(2) || 'N/A'}</div>
                        <div>Upper Bound: $${upper?.toFixed(2) || 'N/A'}</div>
                        <div>Lower Bound: $${lower?.toFixed(2) || 'N/A'}</div>
                    `;
                }
            },
            legend: {
                data: ['Forecast', 'Confidence Interval'],
                top: 25,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: 60,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: formattedDates,
                boundaryGap: false,
                axisLabel: {
                    rotate: 45,
                    interval: Math.max(0, Math.floor(formattedDates.length / 15) - 1)
                }
            },
            yAxis: {
                type: 'value',
                name: 'Sales ($)',
                axisLabel: {
                    formatter: '${value}'
                }
            },
            series: [
                {
                    name: 'Forecast',
                    type: 'line',
                    data: data.values,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 3,
                        color: '#52c41a',
                    }
                },
                {
                    name: 'Confidence Interval',
                    type: 'line',
                    data: data.upper_bound,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 0
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: '#52c41a'
                    },
                    stack: 'confidence-bounds'
                },
                {
                    name: 'Confidence Interval',
                    type: 'line',
                    data: data.lower_bound,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 0
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: '#52c41a'
                    },
                    stack: 'confidence-bounds'
                }
            ]
        };

        chart.setOption(option, true);

        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });
        if (chartRef.current) {
            resizeObserver.observe(chartRef.current);
        }

        const handleWindowResize = () => chart.resize();
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            if (chartRef.current) {
                resizeObserver.unobserve(chartRef.current);
            }
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />;
};

export default SalesChart;