import { AppDispatch, RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCookie,
    setCookie as setCookieAction,
    updatePreferences as updatePreferencesAction,
} from '@/store/features/cookiesThunk';
import { clearCookiesError, resetCookiesState } from '@/store/features/cookiesSlice';
import { CookiePreferences } from '@/types/cookies';


const useCookie = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { cookies, loading, error } = useSelector((state: RootState) => state.cookies);


    const fetchCookies = async () => {
        try {
            await dispatch(fetchCookie()).unwrap();
        } catch (error) {
            console.error('Failed to fetch cookies:', error);
        }
    };

    const setCookie = async (preferences: CookiePreferences) => {
        try {
            await dispatch(setCookieAction(preferences)).unwrap();
        } catch (error) {
            console.error('Failed to set cookie:', error);
            throw error;
        }
    };

    const updatePreferences = async (preferences: CookiePreferences) => {
        try {
            await dispatch(updatePreferencesAction(preferences)).unwrap();
        } catch (error) {
            console.error('Failed to update preferences:', error);
            throw error;
        }
    };

    const clearError = () => {
        dispatch(clearCookiesError());
    };

    const reset = () => {
        dispatch(resetCookiesState());
    };

    return {
        cookies, loading, error,
        fetchCookies, setCookie, updatePreferences,
        clearError, reset
    };
};

export default useCookie;
