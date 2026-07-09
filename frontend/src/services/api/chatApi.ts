import { apiClientCore } from "./client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatApi = {
  send(message: string, history: ChatMessage[]) {
    return apiClientCore.request<{ reply: string }>(
      "/api/v1/ai/chat",
      { method: "POST", body: JSON.stringify({ message, history }) },
      false,
      null,
      false,
      false,
    );
  },
};
