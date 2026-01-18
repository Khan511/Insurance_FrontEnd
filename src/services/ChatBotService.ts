// services/ChatbotService.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ChatMessageRequest, ChatMessageResponse } from "./ServiceTypes";

const baseUrl = "http://localhost:8080/api/chatbot";

export const ChatbotService = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    // Send message and get response
    sendMessage: builder.mutation<ChatMessageResponse, ChatMessageRequest>({
      query: (chatRequest) => ({
        url: "/chat",
        method: "POST",
        body: chatRequest,
      }),
      // Invalidate cache or update queries if needed
      invalidatesTags: ["Chat"],
    }),

    // Get chat history (if you implement it later)
    getChatHistory: builder.query<ChatMessageResponse[], string>({
      query: (conversationId) => ({
        url: `/history/${conversationId}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    // Get quick responses (pre-defined FAQ)
    getQuickResponses: builder.query<string[], void>({
      query: () => ({
        url: "/quick-responses",
        method: "GET",
      }),
    }),

    // Check chatbot status/health
    checkChatbotStatus: builder.query<{ status: string; model: string }, void>({
      query: () => ({
        url: "/status",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useGetQuickResponsesQuery,
  useCheckChatbotStatusQuery,
} = ChatbotService;
