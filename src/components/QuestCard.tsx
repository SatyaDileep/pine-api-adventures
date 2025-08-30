import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, Check, Target, Code2, Send, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ApiPlayground from "./ApiPlayground";
import { Quest } from "@/data/questData";
import { AgentAvatar } from "./AgentAvatar";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

type Message = {
  sender: "user" | "agent";
  content: string;
  showApiButton?: boolean;
  suggestions?: string[];
};

const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversation([
      {
        sender: "agent",
        content: `Hello! I'm your guide for the "${quest.title}" quest. Ready to get started?`,
        suggestions: ["Show me the code", "What's the objective?", "Tell me more about this quest"],
      },
    ]);
  }, [quest]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversation]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || userInput;
    if (!text.trim()) return;

    const userMessage: Message = { sender: "user", content: text };
    setConversation(prev => [...prev, userMessage]);
    setUserInput("");
    setIsAgentLoading(true);

    // Simulate agent response
    await new Promise(resolve => setTimeout(resolve, 1500));

    let agentResponse: Message;

    if (text.toLowerCase().includes("code")) {
      agentResponse = {
        sender: "agent",
        content: `Here is the code snippet for this quest in ${quest.language}. You can copy it and then test it in the API Playground.`,
        showApiButton: true,
      };
    } else if (text.toLowerCase().includes("objective")) {
      agentResponse = {
        sender: "agent",
        content: `The main objective is: "${quest.objective}". Let me know when you're ready for the code.`,
        suggestions: ["I'm ready for the code", "What's the expected output?"],
      };
    } else if (text.toLowerCase().includes("output")) {
        agentResponse = {
            sender: "agent",
            content: `The expected output is a success message, like this: 
json
${quest.expectedOutput}
`,
            suggestions: ["Show me the code", "How do I test this?"],
        };
    } else {
      agentResponse = {
        sender: "agent",
        content: "I can help you with the code, objective, or expected output. What would you like to know?",
        suggestions: ["Show me the code", "What's the objective?", "What's the expected output?"],
      };
    }

    setConversation(prev => [...prev, agentResponse]);
    setIsAgentLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Code snippet ready to paste",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleValidationSuccess = (response: any) => {
    console.log("Validation successful:", response);
    toast({
      title: "Quest Validated!",
      description: "You have successfully completed the quest objective.",
    });
    onComplete();
    setIsApiPlaygroundOpen(false);
  };

  const handleValidationError = (error: any) => {
    console.error("Validation failed:", error);
    toast({
      title: "Validation Failed",
      description: "The API call did not meet the quest requirements.",
      variant: "destructive",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-quest-success';
      case 'Medium': return 'bg-quest-warning';
      case 'Hard': return 'bg-quest-legendary';
      default: return 'bg-quest-primary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{quest.title}</h2>
            <p className="text-muted-foreground">{quest.objective}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[120px]">
          <div className="flex gap-2">
            <Badge className={`${getDifficultyColor(quest.difficulty)} text-white`}>
              {quest.difficulty}
            </Badge>
            <Badge variant="outline" className="border-quest-xp text-quest-xp">
              {quest.xpReward} XP
            </Badge>
          </div>
        </div>
      </div>

      {/* Conversational UI */}
      <div className="flex-grow bg-gradient-card border border-border/50 shadow-card-custom rounded-xl flex flex-col overflow-hidden relative">
        <ScrollArea className="flex-grow p-4 pb-24">
          <div className="space-y-6">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'agent' && <AgentAvatar />}
                <div className={`max-w-md rounded-xl px-4 py-3 ${msg.sender === 'agent' ? 'bg-secondary/50' : 'bg-quest-primary/20'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.showApiButton && (
                    <div className="mt-4">
                        <div className="relative bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm border border-border/50 max-h-64">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(quest.codeSnippet)}
                                className="absolute top-2 right-2 h-7 w-7"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            <pre><code>{quest.codeSnippet}</code></pre>
                        </div>
                        <Dialog open={isApiPlaygroundOpen} onOpenChange={setIsApiPlaygroundOpen}>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm" className="bg-gradient-primary mt-2">
                            <Play className="w-4 h-4 mr-2" />
                            Test in API Playground
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>API Playground - {quest.title}</DialogTitle>
                          </DialogHeader>
                          <ApiPlayground
                            initialUrl={quest.validationEndpoint}
                            initialMethod={quest.api?.method}
                            initialHeaders={quest.api?.headers}
                            initialBody={quest.api?.body}
                            onSuccess={handleValidationSuccess}
                            onError={handleValidationError}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                   {msg.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => handleSendMessage(suggestion)}>
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAgentLoading && (
              <div className="flex items-start gap-3">
                <AgentAvatar />
                <div className="max-w-md rounded-xl px-4 py-3 bg-secondary/50 flex items-center">
                    <div className="w-2 h-2 bg-quest-primary rounded-full animate-pulse-fast mr-2"></div>
                    <div className="w-2 h-2 bg-quest-primary rounded-full animate-pulse-medium mr-2"></div>
                    <div className="w-2 h-2 bg-quest-primary rounded-full animate-pulse-slow"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-card border-t border-border/50">
          <div className="relative">
            <Input
              type="text"
              placeholder="Type your message..."
              className="pr-12"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isAgentLoading}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-gradient-primary"
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || isAgentLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;