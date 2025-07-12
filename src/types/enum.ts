enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system",
}

enum Language {
    EN_INDIA = "en-IN",
    EN_US = "en-US",
}

enum ErrorType {
    API_ERROR = "API_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

enum FileType {
    CUSTOMER_DATA = "customer_data",
    SALES_DATA = "sales_data",
    PRODUCT_DATA = "product_data",
}

enum MimeType {
    TEXT = "text/plain",
    IMAGE = "image/*",
    AUDIO = "audio/*",
    VIDEO = "video/*",
    CSV = "text/csv",
    XML = "application/xml",
    PDF = "application/pdf",
    JSON = "application/json",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export { ErrorType, Theme, Language, FileType, MimeType };
