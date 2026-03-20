import { MessageBubble } from "@/components/MessageBubble";
import type { Message } from "@/components/MessageBubble";
import { SettingsModal } from "@/components/SettingsModal";
import { TypingIndicator } from "@/components/TypingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Toaster } from "@/components/ui/sonner";
import { useSendMessage } from "@/hooks/useQueries";
import {
  Clock,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKeySet, setApiKeySet] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: sendMessage } = useSendMessage();

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages/isTyping used as scroll triggers
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const createNewSession = useCallback(() => {
    const id = generateId();
    const session: ChatSession = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setInput("");
    inputRef.current?.focus();
  }, []);

  const clearCurrentChat = useCallback(() => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [], title: "New Chat" }
          : s,
      ),
    );
    toast.success("Chat cleared");
  }, [activeSessionId]);

  const handleSend = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isTyping) return;

      if (!apiKeySet) {
        setShowSettings(true);
        toast.error("Please set your API key first");
        return;
      }

      let sessionId = activeSessionId;
      if (!sessionId) {
        const id = generateId();
        const newSession: ChatSession = {
          id,
          title: content.slice(0, 40),
          messages: [],
          createdAt: new Date(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(id);
        sessionId = id;
      }

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            messages: [...s.messages, userMsg],
            title: s.messages.length === 0 ? content.slice(0, 40) : s.title,
          };
        }),
      );

      setInput("");
      setIsTyping(true);

      try {
        const response = await sendMessage(content);
        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s,
          ),
        );
      } catch (e) {
        const errMsg: Message = {
          id: generateId(),
          role: "assistant",
          content:
            e instanceof Error
              ? e.message
              : "An error occurred. Please try again.",
          timestamp: new Date(),
          isError: true,
        };
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, errMsg] }
              : s,
          ),
        );
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, apiKeySet, activeSessionId, sendMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePrompt = useCallback(
    (prompt: string) => {
      setInput(prompt);
      // Use the prompt directly to avoid stale closure issue with input state
      handleSend(prompt);
    },
    [handleSend],
  );

  const formatSessionTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  };

  const handleSessionClick = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-30 flex flex-col h-full w-72 flex-shrink-0 border-r border-border"
            style={{ background: "oklch(var(--sidebar))" }}
          >
            {/* Brand */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.42 0.17 250))",
                  }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  YGL AI
                </span>
              </div>
              <button
                type="button"
                data-ocid="sidebar.close_button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3 mb-3">
              <button
                type="button"
                data-ocid="sidebar.primary_button"
                onClick={createNewSession}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-glow"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.45 0.17 250))",
                }}
              >
                <Plus size={16} />
                New Chat
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
              {sessions.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-xs"
                  data-ocid="sidebar.empty_state"
                >
                  <MessageSquare
                    size={20}
                    className="mx-auto mb-2 opacity-40"
                  />
                  No conversations yet
                </div>
              ) : (
                sessions.map((session, i) => (
                  <button
                    type="button"
                    key={session.id}
                    data-ocid={`sidebar.item.${i + 1}`}
                    onClick={() => handleSessionClick(session.id)}
                    className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors group ${
                      activeSessionId === session.id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <MessageSquare
                      size={14}
                      className="flex-shrink-0 mt-0.5 opacity-70"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="opacity-50" />
                        <span className="text-[10px] opacity-50">
                          {formatSessionTime(session.createdAt)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-border space-y-1">
              {activeSession && (
                <button
                  type="button"
                  data-ocid="sidebar.delete_button"
                  onClick={clearCurrentChat}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Clear Chat
                </button>
              )}
              <button
                type="button"
                data-ocid="sidebar.toggle"
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Settings size={14} />
                Settings
                {!apiKeySet && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                    Setup
                  </span>
                )}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN PANEL */}
      <main className="flex-1 flex flex-col min-w-0 chat-bg">
        {/* Header */}
        <header
          className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0"
          style={{ background: "oklch(var(--chat-bg))" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="header.toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {activeSession ? activeSession.title : "Chat"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="header.secondary_button"
              onClick={() => setShowSettings(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Settings size={16} />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.62 0.16 270))",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" data-ocid="chat.list">
          {messages.length === 0 && !isTyping ? (
            <WelcomeScreen onPrompt={handlePrompt} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="flex-shrink-0 border-t border-border px-4 py-4"
          style={{ background: "oklch(var(--chat-bg))" }}
        >
          <div className="max-w-3xl mx-auto">
            {!apiKeySet && (
              <div className="mb-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="text-xs text-primary hover:underline"
                >
                  ⚠️ Set your Gemini API key to start chatting
                </button>
              </div>
            )}
            <div
              className="flex items-end gap-2 rounded-2xl border border-border p-3 focus-within:border-primary/50 transition-colors"
              style={{ background: "oklch(var(--secondary))" }}
            >
              <textarea
                ref={inputRef}
                data-ocid="chat.textarea"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none leading-relaxed max-h-44 min-h-[1.5rem]"
              />
              <button
                type="button"
                data-ocid="chat.submit_button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.45 0.17 250))",
                }}
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground mt-2">
              Press{" "}
              <kbd className="px-1 py-0.5 rounded text-[10px] bg-accent">
                Enter
              </kbd>{" "}
              to send ·{" "}
              <kbd className="px-1 py-0.5 rounded text-[10px] bg-accent">
                Shift+Enter
              </kbd>{" "}
              for newline
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="hidden">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
        >
          caffeine.ai
        </a>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SettingsModal
              onClose={() => setShowSettings(false)}
              apiKeySet={apiKeySet}
              onApiKeySaved={() => setApiKeySet(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
