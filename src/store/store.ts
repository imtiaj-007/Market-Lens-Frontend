import { configureStore } from '@reduxjs/toolkit';
import cookiesReducer from '@/store/features/cookiesSlice';

export const store = configureStore({
    reducer: {
        cookies: cookiesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;