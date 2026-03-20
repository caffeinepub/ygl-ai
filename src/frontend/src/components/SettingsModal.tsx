import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetApiKey } from "@/hooks/useQueries";
import { CheckCircle, Key, Loader2, Save, X } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  onClose: () => void;
  apiKeySet: boolean;
  onApiKeySaved: () => void;
}

export function SettingsModal({
  onClose,
  apiKeySet,
  onApiKeySaved,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const { mutateAsync: setKey, isPending } = useSetApiKey();

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    try {
      await setKey(apiKey.trim());
      setSaved(true);
      onApiKeySaved();
      setTimeout(() => setSaved(false), 2000);
      setApiKey("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="settings.modal"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl"
        style={{ boxShadow: "0 0 60px oklch(0.52 0.18 250 / 0.12)" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Settings</h2>
          </div>
          <button
            type="button"
            data-ocid="settings.close_button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!apiKeySet && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
              <Key size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p>
                To start chatting, please enter your Gemini API key. It is
                stored securely in the backend.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="api-key"
              className="text-sm font-medium text-foreground"
            >
              Gemini API Key
            </Label>
            <Input
              id="api-key"
              data-ocid="settings.input"
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Get your key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 pt-0">
          <Button
            type="button"
            variant="ghost"
            data-ocid="settings.cancel_button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            data-ocid="settings.submit_button"
            onClick={handleSave}
            disabled={!apiKey.trim() || isPending}
            className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : saved ? (
              <CheckCircle size={14} className="text-green-400" />
            ) : (
              <Save size={14} />
            )}
            {isPending ? "Saving..." : saved ? "Saved!" : "Save API Key"}
          </Button>
        </div>
      </div>
    </div>
  );
}
