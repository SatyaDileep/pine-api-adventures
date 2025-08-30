import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const AgentAvatar = () => {
  return (
    <Avatar className="w-8 h-8 border-2 border-quest-primary">
      <AvatarImage src="/placeholder.svg" alt="AI Agent" />
      <AvatarFallback>
        <Bot className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
  );
};
