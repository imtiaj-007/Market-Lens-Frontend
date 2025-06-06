import { configureStore } from '@reduxjs/toolkit';
import cookiesReducer from '@/store/features/cookiesSlice';
import fileReducer from '@/store/features/fileSlice';

export const store = configureStore({
    reducer: {
        cookies: cookiesReducer,
        file: fileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;