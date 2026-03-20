export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-appear">
      {/* AI Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.42 0.17 250))",
        }}
      >
        Y
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          YGL AI
        </span>
        <div className="bubble-ai rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
