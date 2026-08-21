export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: string;
  createdAt: string;
  isTyping?: boolean;
}
