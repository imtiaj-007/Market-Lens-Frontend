export interface FileSummary {
    rows: number;
    columns: number;
    column_names?: string[];
    fileSize?: string;
    fileType?: string;
    uploadDate?: string;
}

export interface FileFormatRequirement {
    title: string;
    description: string;
    example: string;
} 