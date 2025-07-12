/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileState, ProcessFileResponse } from '@/types/upload';
import { processFile } from './fileThunk';
import { CustomError } from '@/types/errors';
import { FileType } from '@/types/enum';
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
    loading: false,
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
        resetFileState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Process file
            .addCase(processFile.pending, (state: FileState) => {
                state.loading = true;
                state.error.processFileError = null;
            })
            .addCase(processFile.fulfilled, (state: FileState, action: PayloadAction<{fileType: FileType, data: ProcessFileResponse}>) => {
                state.loading = false;
                state.fileResponse[action.payload.fileType] = { report: action.payload.data.report };
                state.fileIds[action.payload.fileType] = action.payload.data.file_id;
            })
            .addCase(processFile.rejected, (state: FileState, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error.processFileError = action.payload as CustomError;
            })
    },
});

export const { resetFileState, clearFileError } = fileSlice.actions;
export default fileSlice.reducer;
