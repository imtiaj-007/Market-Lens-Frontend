import React, { ReactElement } from "react";
import { BarChart2, Users, Package, TrendingUp } from "lucide-react";
import { FileType } from "@/types/enum";
import { ReportData, SampleDataCard } from "@/types/data-quality";

interface DataQualityTab {
    value: FileType;
    icon: ReactElement;
    className: string;
}

export const sampleData: {
    Sample_Data_Cards: Array<SampleDataCard>;
    Data_Quality_Tabs: Record<FileType, DataQualityTab>;
    Data_Quality_Report: ReportData;
} = {
    Sample_Data_Cards: [
        {
            key: FileType.SALES_DATA,
            title: 'E-commerce Sales Data',
            description: '12 months of comprehensive sales data with payment methods, channels, and campaigns',
            rows: '10,248',
            columns: '12',
            color: 'emerald',
            icon: TrendingUp
        },
        {
            key: FileType.CUSTOMER_DATA,
            title: 'Customer Demographics',
            description: '1000 customers with demographics, purchase history, and loyalty status',
            rows: '1,000',
            columns: '11',
            color: 'blue',
            icon: Users
        },
        {
            key: FileType.PRODUCT_DATA,
            title: 'Product Catalog',
            description: '3,500 products with categories, pricing, and inventory data',
            rows: '3,500',
            columns: '10',
            color: 'purple',
            icon: Package
        }
    ],
    Data_Quality_Tabs: {
        [FileType.SALES_DATA]: {
            value: FileType.SALES_DATA,
            icon: React.createElement(BarChart2, { className: "size-4" }),
            className: 'data-[state=active]:bg-emerald-100 data-[state=active]:dark:bg-emerald-900/50 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-200 dark:data-[state=active]:border-emerald-800',
        },
        [FileType.CUSTOMER_DATA]: {
            value: FileType.CUSTOMER_DATA,
            icon: React.createElement(Users, { className: "size-4" }),
            className: 'data-[state=active]:bg-blue-100 data-[state=active]:dark:bg-blue-900/50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800',
        },
        [FileType.PRODUCT_DATA]: {
            value: FileType.PRODUCT_DATA,
            icon: React.createElement(Package, { className: "size-4" }),
            className: 'data-[state=active]:bg-purple-100 data-[state=active]:dark:bg-purple-900/50 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-purple-200 dark:data-[state=active]:border-purple-800',
        },
    },
    Data_Quality_Report: {
        report: {
            can_process: false,
            summary: {
                file_type: "customer_data",
                original_shape: [20, 9],
                final_shape: [20, 9],
                data_quality_score: 100,
                processing_time_seconds: 0.05994725227355957,
                rows_processed: 20
            },
            transformations: [
                "Mapped column 'customer_id' to 'loyalty_tier'",
                "Mapped column 'name' to 'name'",
                "Mapped column 'gender' to 'gender'",
                "Mapped column 'city' to 'city'",
                "Mapped column 'country' to 'country'",
                "Mapped column 'income_level' to 'income_level'",
                "Mapped column 'occupation' to 'occupation'",
                "Mapped column 'registration_date' to 'registration_date'",
                "Mapped column 'last_active_date' to 'last_active_date'",
                "Converted column 'loyalty_tier' from object to category",
                "Converted column 'gender' from object to category",
                "Converted column 'income_level' from object to category",
                "Converted column 'registration_date' from object to datetime64[ns]",
                "Converted column 'last_active_date' from object to datetime64[ns]",
                "Standardized column names: ['loyalty_tier', 'name', 'gender', 'city', 'country', 'income_level', 'occupation', 'registration_date', 'last_active_date']"
            ],
            warnings: [
                "Missing recommended columns: ['age', 'loyalty_tier']"
            ],
            suggestions: [
                "Consider standardizing date formats across all date columns",
                "Implement email validation rules for better data integrity",
                "Review outlier detection thresholds for numeric columns",
                "Add data type constraints to prevent invalid entries"
            ],
            column_health: {
                loyalty_tier: {
                    completeness_score: 100,
                    uniqueness_score: 100,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                name: {
                    completeness_score: 100,
                    uniqueness_score: 100,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                gender: {
                    completeness_score: 100,
                    uniqueness_score: 15,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                city: {
                    completeness_score: 100,
                    uniqueness_score: 100,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                country: {
                    completeness_score: 100,
                    uniqueness_score: 90,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                income_level: {
                    completeness_score: 100,
                    uniqueness_score: 15,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                occupation: {
                    completeness_score: 100,
                    uniqueness_score: 100,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                registration_date: {
                    completeness_score: 100,
                    uniqueness_score: 0,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                },
                last_active_date: {
                    completeness_score: 100,
                    uniqueness_score: 0,
                    validity_score: 100,
                    overall_score: 100,
                    issues: [],
                    warnings: []
                }
            },
            statistics: {
                missing_values: {},
                outliers: {}
            }
        }
    },
};