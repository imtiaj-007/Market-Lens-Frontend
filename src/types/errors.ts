import { AxiosError } from "axios";

interface CustomError {
    code?: string;
    message?: string;
    name?: string;
    status: number;
}

const isCustomError = (error: unknown): error is CustomError => {
    return error instanceof Error && "type" in error;
};

const formatError = (error: unknown): CustomError => {
    if (error instanceof AxiosError) {
        const { code, message, name, status } = error;
        return { code, message, name, status } as CustomError;
    }
    else if (error instanceof Error) {
        const { message, name } = error;
        return { message, name, status: 500 } as CustomError;
    }
    return error as CustomError;
};

export { isCustomError, formatError };
export type { CustomError };
