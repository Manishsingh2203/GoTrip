import api from "./api";

export const aiChatAPI = {
  ask: (message, context = "") =>
    api.post("/ai/chat", {
      query: message,
      context
    }),
};
