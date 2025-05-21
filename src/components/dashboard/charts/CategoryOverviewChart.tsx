import { PerformanceData } from '@/types/analytics';
import BasePieChart from '@/components/charts/BasePieChart';
import type { BasePieChartDataItem } from '@/components/charts/BasePieChart';

interface CategoryOverviewChartProps {
    data: PerformanceData['categories'];
    isDarkMode: boolean;
    isClient: boolean;
}

const CategoryOverviewChart: React.FC<CategoryOverviewChartProps> = ({ data, isDarkMode, isClient }) => {
    // themeColors is handled by BasePieChart for primary coloring

    if (!isClient || !data || data.length === 0) {
        return <div style={{ width: '100%', height: '320px' }} className="flex items-center justify-center text-gray-500 dark:text-gray-400">Loading category data...</div>;
    }

    const seriesData: BasePieChartDataItem[] = data.map((category) => ({
        name: category.name,
        value: category.revenue,
    }));

    const tooltipFormatter = (params: any) => {
        if (!params || !params.name || params.value === undefined) return '';
        const category = data.find(c => c.name === params.name);
        if (!category) return '';

        return `<div style="font-weight:bold; margin-bottom: 5px;">${params.name}</div>
                <div>Revenue: $${Number(params.value).toLocaleString()}</div>
                <div>Products: ${category.products_count}</div>
                <div>Market Share: ${params.percent}%</div>`;
    };

    const legendFormatter = (name: string) => {
        const category = data.find(c => c.name === name);
        return category ? `${name} (${category.percentage}%)` : name;
    };

    return (
        <BasePieChart 
            titleText="Revenue by Category"
            seriesName="Categories"
            seriesData={seriesData}
            isDarkMode={isDarkMode}
            isClient={isClient}
            height="320px"
            tooltipFormatter={tooltipFormatter}
            legendFormatter={legendFormatter}
            additionalOptions={{
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'middle',
                },
            }}
        />
    );
};

export default CategoryOverviewChart; 