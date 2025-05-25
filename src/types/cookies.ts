import { CustomError } from "@/types/errors";
import { Theme, Language } from "@/types/enum";


interface UserPreferences {
    theme: Theme;
    language: Language;
}

interface CookiePreferences {
    user_id?: string;
    user_preferences?: UserPreferences;
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface CookieResponse {
    message?: string;
    user_id?: string;
    user_preferences?: UserPreferences;
    necessary?: boolean;
    analytics?: boolean;
    marketing?: boolean;
}

interface CookieState {
    cookies: CookiePreferences | null;
    totalCount: number;
    loading: boolean;
    error: CustomError | null;
}

export type { UserPreferences, CookiePreferences, CookieResponse, CookieState };
