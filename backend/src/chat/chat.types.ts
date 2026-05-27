export type ChatMessage = {
  user: string;
  text: string;
  timestamp: number;
};

export type SendMessagePayload = {
  user: string;
  text: string;
};
