import { AxiosResponse } from "axios";
import axiosHandler from "@/lib/axios";
import { SessionRequest, SessionResponse } from "@/types/sessions";


const SESSION_ENDPOINTS = {
    PROCESS: "/sessions",
};

interface SessionService {
    createSession: (req_body: SessionRequest) => Promise<SessionResponse>;
}

const SessionService: SessionService = {
    createSession: async (req_body: SessionRequest): Promise<SessionResponse> => {
        try {
            
            const response: AxiosResponse<SessionResponse> = await axiosHandler.post(
                SESSION_ENDPOINTS.PROCESS,
                req_body
            )
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

export default SessionService;
