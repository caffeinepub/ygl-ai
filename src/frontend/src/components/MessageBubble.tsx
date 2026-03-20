import { Check, Copy } from "lucide-react";
import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.role === "user") {
    return (
      <div
        className="flex items-end justify-end gap-2 message-appear"
        data-ocid={`chat.item.${index + 1}`}
      >
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          <div className="bubble-user rounded-2xl rounded-br-sm px-4 py-2.5 text-white text-sm leading-relaxed shadow-md">
            {message.content}
          </div>
          <span className="text-xs text-muted-foreground pr-1">{timeStr}</span>
        </div>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.62 0.16 270))",
          }}
        >
          A
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 message-appear"
      data-ocid={`chat.item.${index + 1}`}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.42 0.17 250))",
        }}
      >
        Y
      </div>
      <div className="flex flex-col gap-1 max-w-[70%]">
        <span className="text-xs font-medium text-muted-foreground">
          YGL AI
        </span>
        <div
          className={`bubble-ai rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed shadow-md ${
            message.isError
              ? "border border-destructive/40 bg-destructive/10"
              : ""
          }`}
        >
          <p
            className={`text-foreground whitespace-pre-wrap ${
              message.isError ? "text-destructive" : ""
            }`}
          >
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-2 pl-1">
          <span className="text-xs text-muted-foreground">{timeStr}</span>
          {!message.isError && (
            <button
              type="button"
              onClick={handleCopy}
              data-ocid={`chat.secondary_button.${index + 1}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 px-1.5 rounded hover:bg-accent"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
