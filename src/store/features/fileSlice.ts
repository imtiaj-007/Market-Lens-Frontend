/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileState, ProcessFileResponse } from '@/types/upload';
import { processFile } from './fileThunk';
import { CustomError } from '@/types/errors';
import { FileType } from '@/types/enum';
import { fileStorage } from '@/lib/fileStorage';
import { sampleData } from '@/core/sample-data';
import { ReportData } from '@/types/data-quality';

const initialState: FileState = {
    fileIds: Object.entries(FileType).reduce(
        (acc, [_, value]) => {
            acc[value] = null;
            return acc;
    }, {} as Record<FileType, string | null>),
    fileResponse: Object.entries(FileType).reduce(
        (acc, [_, value]) => {
            acc[value] = null;
            return acc;
    }, {} as Record<FileType, ReportData | null>),
    totalCount: 0,
    loading: {
        processFile: false,
        uploadFile: false,
    },
    error: {
        processFileError: null,
        uploadFileError: null,
    }
};

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        clearFileError: (state) => {
            state.error.processFileError = null;
            state.error.uploadFileError = null;
        },
        setFileIds: (state, action: PayloadAction<{ fileType: FileType, file: File }>) => {
            const fileId = fileStorage.storeFile(action.payload.file);
            state.fileIds[action.payload.fileType] = fileId;
        },
        resetFileState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Process file
            .addCase(processFile.pending, (state: FileState) => {
                state.loading.processFile = true;
                state.error.processFileError = null;
            })
            .addCase(processFile.fulfilled, (state: FileState, action: PayloadAction<{fileType: FileType, data: ProcessFileResponse}>) => {
                state.loading.processFile = false;
                state.fileResponse[action.payload.fileType] = { report: action.payload.data.report };
            })
            .addCase(processFile.rejected, (state: FileState, action: PayloadAction<unknown>) => {
                state.loading.processFile = false;
                state.error.processFileError = action.payload as CustomError;
            })
    },
});

export const { setFileIds, resetFileState, clearFileError } = fileSlice.actions;
export default fileSlice.reducer;
