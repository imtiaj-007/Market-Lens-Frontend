import { AppDispatch, RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import {
    processFile as processFileAction,
} from '@/store/features/fileThunk';
import { clearFileError, resetFileState } from '@/store/features/fileSlice';
import { ProcessFileRequest } from '@/types/upload';


export const useFile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { fileIds, fileResponse, loading, error } = useSelector((state: RootState) => state.file);


    const processFile = async (payload: ProcessFileRequest) => {
        try {
            return await dispatch(processFileAction(payload)).unwrap();
        } catch (error) {
            console.error('Failed to process file:', error);
        }
    };

    const clearError = () => {
        dispatch(clearFileError());
    };

    const reset = () => {
        dispatch(resetFileState());
    };

    return {
        fileIds, fileResponse, loading, error,
        processFile, clearError, reset
    };
};
