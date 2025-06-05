import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomError, formatError } from '@/types/errors';
import { ProcessFileRequest, ProcessFileResponse } from '@/types/upload';
import FileService from '@/services/fileService';
import { FileType } from '@/types/enum';


// Process file
export const processFile = createAsyncThunk<
    { fileType: FileType, data: ProcessFileResponse },
    ProcessFileRequest,
    { rejectValue: CustomError }
>(
    'files/processFile',
    async (data, { rejectWithValue }) => {
        try {
            return await FileService.processFile(data);
        } catch (error: unknown) {                 
            return rejectWithValue(formatError(error));
        }
    }
);