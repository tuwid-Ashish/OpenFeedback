import { Messages } from "@/models/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAccepctMessages?: string;
    messages?: Array<Messages>
}