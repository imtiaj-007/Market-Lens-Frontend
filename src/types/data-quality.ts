import { FileType } from "@/types/enum";

export type SampleDataCard = {
    key: FileType;
    title: string;
    description: string;
    rows: string;
    columns: string;
    color: string;
    icon: React.ElementType;
};

export interface ReportData {
    report: {
        can_process: boolean;
        summary: {
            file_type: string;
            original_shape: [number, number];
            final_shape: [number, number];
            data_quality_score: number;
            processing_time_seconds: number;
            rows_processed: number;
        };
        transformations: string[];
        warnings: string[];
        suggestions: string[];
        column_health: {
            [key: string]: {
                completeness_score: number;
                uniqueness_score: number;
                validity_score: number;
                overall_score: number;
                issues: string[];
                warnings: string[];
            };
        };
        statistics: {
            missing_values: Record<string, unknown>;
            outliers: Record<string, unknown>;
        };
    };
};
