import { apiRequest, isDemoMode } from "./plantDoctorApi";
import type { ChatMessage } from "@/types/chat";
import { getDemoChatReply } from "@/demo/chatData";

export async function askPlantDoctor(
  message: string,
  language: string,
  context?: string
): Promise<ChatMessage> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getDemoChatReply(message, language);
  }

  return apiRequest<ChatMessage>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, language, context })
  });
}
