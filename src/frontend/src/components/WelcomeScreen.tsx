import { Globe, Shield, Sparkles, Zap } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a short story about a robot learning to feel emotions",
  "What are the best practices for writing clean code?",
  "Help me plan a healthy weekly meal prep routine",
];

const FEATURES = [
  { icon: Zap, label: "Fast responses" },
  { icon: Shield, label: "Safe & private" },
  { icon: Globe, label: "Broad knowledge" },
];

interface WelcomeScreenProps {
  onPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 gap-10">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.18 250), oklch(0.42 0.17 250))",
          }}
        >
          <Sparkles size={28} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            YGL AI
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm max-w-xs text-center">
            Your intelligent assistant — ask anything, get instant answers.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground"
          >
            <Icon size={13} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl">
        <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-widest font-medium">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              type="button"
              key={prompt}
              data-ocid={`welcome.item.${EXAMPLE_PROMPTS.indexOf(prompt) + 1}`}
              onClick={() => onPrompt(prompt)}
              className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent transition-all text-sm text-foreground"
            >
              <span className="line-clamp-2 leading-relaxed">{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
