import "./chatbot.css";
import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Shield,
  Zap,
  History,
  RefreshCw,
} from "lucide-react";
import { useSendMessageMutation } from "@/services/ChatBotService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "suggestion" | "regular";
  error?: boolean;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your insurance assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "regular",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId] = useState(
    `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RTK Query mutation hook
  const [sendMessage, { isLoading: isSending, error: sendError }] =
    useSendMessageMutation();

  const quickQuestions = [
    "How to file a claim?",
    "What insurance plans do you offer?",
    "Need 24/7 support",
    "Policy renewal process",
    "Calculate premium",
    "Network hospitals",
    "Document requirements",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear error messages after 5 seconds
    if (sendError) {
      const timer = setTimeout(() => {
        // You could dispatch an action to clear error state if you have one
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sendError]);

  const sendMessageHandler = async (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim()) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      // Send message via RTK Query mutation
      const result = await sendMessage({
        message: messageContent,
        conversationId,
        context: "insurance",
      }).unwrap();

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message from bot
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting. Please try again or contact our support team directly.",
        sender: "bot",
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessageHandler(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your insurance assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "regular",
      },
    ]);
  };

  const regenerateResponse = async (lastMessageId: string) => {
    // Find the last user message to regenerate response
    const lastUserMessage = messages
      .filter((msg) => msg.sender === "user")
      .pop();

    if (lastUserMessage) {
      // Remove the last bot response (if any)
      const lastMessageIndex = messages.findIndex(
        (msg) => msg.id === lastMessageId
      );
      if (lastMessageIndex > 0) {
        const newMessages = messages.slice(0, lastMessageIndex);
        setMessages(newMessages);

        // Resend the last user message
        await sendMessageHandler(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-left">
              <div className="bot-avatar">
                <Shield size={20} />
              </div>
              <div>
                <h4>Insurance Assistant</h4>
                <div className="header-status">
                  <span className="status online">Online</span>
                  <span className="status-tag">
                    <Zap size={12} /> AI Powered
                  </span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="action-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                } ${msg.error ? "error-message" : ""}`}
              >
                <div className="message-header">
                  <div className="message-sender">
                    {msg.sender === "bot" ? (
                      <>
                        <Bot size={16} />
                        <span>Insurance Assistant</span>
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        <span>You</span>
                      </>
                    )}
                  </div>
                  {msg.sender === "bot" && !msg.error && (
                    <button
                      className="regenerate-btn"
                      onClick={() => regenerateResponse(msg.id)}
                      title="Regenerate response"
                    >
                      <RefreshCw size={12} />
                    </button>
                  )}
                </div>
                <div className="message-content">{msg.content}</div>
                <div className="message-footer">
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {msg.error && (
                    <span className="error-badge">Connection Error</span>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="message bot-message">
                <div className="message-sender">
                  <Bot size={16} />
                  <span>Insurance Assistant</span>
                </div>
                <div className="typing-indicator">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {sendError && (
              <div className="connection-error">
                <p>⚠️ Connection issue. Trying to reconnect...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 3 && (
            <div className="quick-questions">
              <div className="quick-questions-header">
                <History size={16} />
                <p className="quick-questions-title">Frequently Asked:</p>
              </div>
              <div className="quick-buttons">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="quick-btn"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isSending}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="input-area">
            <div className="input-wrapper">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your insurance question here..."
                rows={1}
                disabled={isSending}
                className={sendError ? "input-error" : ""}
              />
              <div className="input-hints">
                <small>Press Enter to send • Shift+Enter for new line</small>
              </div>
            </div>
            <button
              className="send-btn"
              onClick={() => sendMessageHandler()}
              disabled={isSending || !inputValue.trim()}
              title="Send message"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <small>
              This AI assistant provides general information. For specific
              policy details, contact our support team.
            </small>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`floating-chat-btn ${isOpen ? "hidden" : ""} ${
          sendError ? "btn-error" : ""
        }`}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
        <span className="notification-dot"></span>
        {messages.length > 1 && (
          <span className="message-count">{messages.length - 1}</span>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
