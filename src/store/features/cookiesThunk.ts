import { createAsyncThunk } from '@reduxjs/toolkit';
import { CookiePreferences, CookieResponse } from '@/types/cookies';
import CookieService from '@/services/cookieService';
import { CustomError, formatError } from '@/types/errors';


// Fetch all cookies
export const fetchCookie = createAsyncThunk<
    CookieResponse,
    void,
    { rejectValue: CustomError }
>(
    'cookies/fetchCookie',
    async (_, { rejectWithValue }) => {
        try {
            return await CookieService.getCookie();
        } catch (error: unknown) {                 
            return rejectWithValue(formatError(error));
        }
    }
);

// Set cookie
export const setCookie = createAsyncThunk<
    CookieResponse,
    CookiePreferences,
    { rejectValue: CustomError }
>(
    'cookies/setCookie',
    async (cookie, { rejectWithValue }) => {
        try {
            return await CookieService.setCookie(cookie);
        } catch (error: unknown) {
            return rejectWithValue(formatError(error));
        }
    }
);

// Update preferences
export const updatePreferences = createAsyncThunk<
    CookieResponse,
    CookiePreferences,
    { rejectValue: CustomError }
>(
    'cookies/updatePreferences',
    async (preferences, { rejectWithValue }) => {
        try {
            return await CookieService.updatePreferences(preferences);
        } catch (error: unknown) {
            return rejectWithValue(formatError(error));
        }
    }
);



