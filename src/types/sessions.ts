export interface SessionRequest {
    customer_data: string | null;
    product_data: string | null;
    sales_data: string | null;
}

export interface SessionResponse {
    session_id: string;
    session_name?: string | null;
    total_files_uploaded: number;
    files_processed: number;
    file_ids: string[];
    tags: string[];
    notes?: string | null;
}
