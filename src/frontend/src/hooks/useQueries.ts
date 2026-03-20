import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSendMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      const response = await actor.sendUserMessage(content);
      return response;
    },
  });
}

export function useSetApiKey() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (apiKey: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.setApiKey(apiKey);
    },
  });
}
