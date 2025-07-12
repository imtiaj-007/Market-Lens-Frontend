import { AxiosResponse } from "axios";
import axiosHandler from "@/lib/axios";
import { ProcessFileRequest, ProcessFileResponse } from "@/types/upload";
import { FileType } from "@/types/enum";


const FILE_ENDPOINTS = {
    PROCESS: "/process-file",
};

interface FileService {
    processFile: (file: ProcessFileRequest) => Promise<{ fileType: FileType, data: ProcessFileResponse }>;
}

const FileService: FileService = {
    processFile: async (file: ProcessFileRequest): Promise<{ 
        fileType: FileType, data: ProcessFileResponse 
    }> => {
        try {
            const formData = new FormData();
            formData.append("file", file.file);
            formData.append("file_type", file.file_type);
            formData.append("mime_type", file.mime_type);
            
            const response: AxiosResponse<ProcessFileResponse> = await axiosHandler.postFormData(
                FILE_ENDPOINTS.PROCESS,
                formData
            )
            return { fileType: file.file_type, data: response.data };
        } catch (error) {
            throw error;
        }
    },
}

export default FileService;
