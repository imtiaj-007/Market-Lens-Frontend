import { AppDispatch, RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import {
    processFile as processFileAction,
} from '@/store/features/fileThunk';
import { setFileIds, clearFileError, resetFileState } from '@/store/features/fileSlice';
import { ProcessFileRequest } from '@/types/upload';
import { FileType } from '@/types/enum';


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

    const setFile = (fileType: FileType, file: File) => {
        dispatch(setFileIds({fileType, file}));
    };

    const clearError = () => {
        dispatch(clearFileError());
    };

    const reset = () => {
        dispatch(resetFileState());
    };

    return {
        fileIds, fileResponse, loading, error,
        processFile, setFile,
        clearError, reset
    };
};
