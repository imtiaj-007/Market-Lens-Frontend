import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CookieState, CookieResponse, CookiePreferences } from '@/types/cookies';
import { fetchCookie, setCookie, updatePreferences } from './cookiesThunk';
import { CustomError } from '@/types/errors';

const initialState: CookieState = {
    cookies: null,
    totalCount: 0,
    loading: false,
    error: null
};

const cookiesSlice = createSlice({
    name: 'cookies',
    initialState,
    reducers: {
        clearCookiesError: (state) => {
            state.error = null;
        },
        resetCookiesState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch cookie
            .addCase(fetchCookie.pending, (state: CookieState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCookie.fulfilled, (state: CookieState, action: PayloadAction<CookieResponse>) => {
                state.loading = false;
                state.cookies = action.payload as CookiePreferences;
            })
            .addCase(fetchCookie.rejected, (state: CookieState, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as CustomError;
            })

            // Set cookie
            .addCase(setCookie.pending, (state: CookieState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setCookie.fulfilled, (state: CookieState, action: PayloadAction<CookieResponse>) => {
                state.loading = false;
                state.cookies = action.payload as CookiePreferences;
            })
            .addCase(setCookie.rejected, (state: CookieState, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as CustomError;
            })

            // Update preferences
            .addCase(updatePreferences.pending, (state: CookieState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePreferences.fulfilled, (state: CookieState, action: PayloadAction<CookieResponse>) => {
                state.loading = false;
                state.cookies = action.payload as CookiePreferences;
            })
            .addCase(updatePreferences.rejected, (state: CookieState, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as CustomError;
            })
    },
});

export const { resetCookiesState, clearCookiesError } = cookiesSlice.actions;
export default cookiesSlice.reducer;
