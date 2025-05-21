// A more generic type for ECharts formatter callback parameters.
// This aims to be compatible with what ECharts passes to formatter functions.
export interface FormatterCallbackParams {
    componentType?: 'series' | 'markPoint' | 'markLine' | 'markArea' | 'legend' | 'timeline' | 'tooltip' | 'title' | 'dataZoom' | 'visualMap' | 'toolbox' | 'graphic';
    seriesType?: string;
    seriesIndex?: number;
    seriesName?: string;
    name?: string;
    dataIndex?: number;
    data?: unknown; // Changed from any to unknown
    value?: unknown; // Changed from any to unknown
    color?: string;
    marker?: string; // Specific to tooltip formatters
    percent?: number; // Specific to pie chart formatters
    // ECharts might add other properties dynamically depending on the context.
    // Using [key: string]: any; to allow for that flexibility if needed, but it's often better to be more specific if possible.
    // For now, let's list common ones and avoid [key: string]: any unless strictly necessary to pass linting for specific ECharts versions.
    // Let's re-add if specific errors demand it. The goal is to be compatible with echarts.TooltipOption.formatter and echarts.SeriesLabelOption.formatter params.
    dimensionNames?: string[];
    encode?: object;
    $vars?: string[];
    axisDim?: string;
    axisIndex?: number;
    axisType?: string;
    axisId?: string;
    axisValue?: string | number;
    axisValueLabel?: string;
}

export type AxisLabelFormatterParams = string | number; // For axisLabel.formatter

// --- Specific types/interfaces for shaping data within formatters ---

// For TrendChart tooltips, formatter often gets an array. Each item is a FormatterCallbackParams.
// Individual series items in the tooltip will have seriesName, value, color from FormatterCallbackParams.
// The `axisValue` is typically on `params[0].axisValue` if `params` is an array for axis tooltips.
// We'll handle this structure directly in the component using FormatterCallbackParams.

// For ScatterPlot tooltips, `params.data` often holds the specific point data.
export interface ScatterPointData {
    name: string;
    value: [number, number]; // e.g., [revenue, growth]
    // symbolSize could also be part of this data structure if set per point
}

// For BarChart series label.formatter, `params` is FormatterCallbackParams.
// We might assert parts of it, e.g., params.value is a number.
export interface BarLabelCallbackParams extends FormatterCallbackParams {
    value: number; // Overriding to ensure value is number for this specific label context
    name: string; // Ensure name is string
}

// Theme-aware color palette
export const getThemeColors = (isDark: boolean) => ({
    primary: isDark ? '#5DADF0' : '#3182CE',
    secondary: isDark ? '#5DE0D8' : '#38B2AC',
    accent: isDark ? '#F0D078' : '#D69E2E',
    positive: isDark ? '#68D391' : '#38A169',
    negative: isDark ? '#FC8181' : '#E53E3E',
    neutral: isDark ? '#A0AEC0' : '#718096',
    highlight: isDark ? '#B794F4' : '#805AD5',
    categoryColors: isDark
        ? ['#5DADF0', '#5DE0D8', '#F0D078', '#68D391', '#B794F4', '#FC8181', '#F6AD55', '#4A5568', '#4FD1C5', '#B7791F']
        : ['#3182CE', '#38B2AC', '#D69E2E', '#38A169', '#805AD5', '#E53E3E', '#DD6B20', '#2C5282', '#2C7A7B', '#774D00'],
    chartTextColor: isDark ? '#E2E8F0' : '#2D3748',
    chartSubTextColor: isDark ? '#A0AEC0' : '#718096',
    chartAxisLineColor: isDark ? '#4A5568' : '#CBD5E0',
    chartSplitLineColor: isDark ? '#3E4859' : '#E2E8F0',
    chartBackgroundColor: 'transparent',
    tooltipBackgroundColor: isDark ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    tooltipTextColor: isDark ? '#E2E8F0' : '#1A202C',
    tooltipBorderColor: isDark ? '#4A5568' : '#E2E8F0',
    pieBorderColor: isDark ? '#2D3748' : '#FFFFFF',
}); 