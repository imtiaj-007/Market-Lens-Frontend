import { AxiosResponse } from "axios";
import axiosHandler from "@/lib/axios";
import { CookiePreferences, CookieResponse } from "@/types/cookies";


const COOKIES_ENDPOINTS = {
    GET: "/cookies/get-cookie",
    SET: "/cookies/set-cookie",
    UPDATE: "/cookies/update-preferences",
};

interface CookieService {
    getCookie: () => Promise<CookieResponse>;
    setCookie: (cookie: CookiePreferences) => Promise<CookieResponse>;
    updatePreferences: (preferences: CookiePreferences) => Promise<CookieResponse>;
}

const CookieService: CookieService = {
    getCookie: async (): Promise<CookieResponse> => {
        try {
            const response: AxiosResponse<CookieResponse> = await axiosHandler.get(
                COOKIES_ENDPOINTS.GET
            )
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    setCookie: async (cookie: CookiePreferences): Promise<CookieResponse> => {
        try {
            const response: AxiosResponse<CookieResponse> = await axiosHandler.post(
                COOKIES_ENDPOINTS.SET, 
                cookie
            )
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePreferences: async (preferences: CookiePreferences): Promise<CookieResponse> => {
        try {
            const response: AxiosResponse<CookieResponse> = await axiosHandler.put(
                COOKIES_ENDPOINTS.UPDATE, 
                preferences
            )
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default CookieService;
