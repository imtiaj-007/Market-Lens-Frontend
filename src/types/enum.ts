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

enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system",
}

enum Language {
    EN_INDIA = "en-IN",
    EN_US = "en-US",
}

export { ErrorType, Theme, Language, FileType };
