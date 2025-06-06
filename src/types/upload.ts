import { TrendingUp, Users, Package } from 'lucide-react';
import { FileType } from '@/types/enum';
import { CustomError } from '@/types/errors';
import { ReportData } from '@/types/data-quality';


export interface FileState {
    fileIds: Record<FileType, string | null>;
    fileResponse: Record<FileType, ReportData | null>;
    totalCount: number;
    loading: {
        processFile: boolean;
        uploadFile: boolean;
    };
    error: {
        processFileError: CustomError | null;
        uploadFileError: CustomError | null;
    };
}

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

export interface ProcessFileRequest {
    file: File;
    fileType: FileType;
}

export interface ProcessFileResponse extends ReportData {
    file: string;
}

export type ColorMap = {
    [key in FileType]: {
        border: string;
        background: string;
        text: string;
        button: string;
    };
}

export const colorMap: ColorMap = {
    [FileType.SALES_DATA]: {
        border: 'border-emerald-100 dark:border-emerald-800',
        background: 'bg-emerald-100 dark:bg-emerald-900/50',
        text: 'text-emerald-600 dark:text-emerald-400',
        button: 'bg-emerald-600 dark:bg-emerald-500'
    },
    [FileType.CUSTOMER_DATA]: {
        border: 'border-blue-100 dark:border-blue-800',
        background: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 dark:bg-blue-500'
    },
    [FileType.PRODUCT_DATA]: {
        border: 'border-purple-100 dark:border-purple-800',
        background: 'bg-purple-100 dark:bg-purple-900/50',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 dark:bg-purple-500'
    }
};

export const fileTypes = [
    {
        key: FileType.SALES_DATA,
        type: FileType.SALES_DATA,
        title: 'Sales Data',
        icon: TrendingUp,
        description: 'Upload transaction and sales records',
        requirements: ['transaction_id', 'customer_id', 'product_id', 'purchase_date'],
    },
    {
        key: FileType.CUSTOMER_DATA,
        type: FileType.CUSTOMER_DATA,
        title: 'Customer Data',
        icon: Users,
        description: 'Upload customer information and demographics',
        requirements: ['customer_id', 'customer_name', 'customer_email', 'registration_date'],
    },
    {
        key: FileType.PRODUCT_DATA,
        type: FileType.PRODUCT_DATA,
        title: 'Product Data',
        icon: Package,
        description: 'Upload product catalog and inventory',
        requirements: ['product_id', 'product_name', 'product_category', 'product_price'],
    }
];

export const sampleFiles = [
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
];