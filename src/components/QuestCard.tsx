import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, Check, AlertCircle, Target, Code2, MessageCircle } from "lucide-react";
import { useState } from "react";
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

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const { toast } = useToast();
  const [agentInput, setAgentInput] = useState("");
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState(false);

  const handleAskAgent = async () => {
    setIsAgentLoading(true);
    setAgentResponse(null);
    // Simulate agent response
    await new Promise(resolve => setTimeout(resolve, 1200));
    setAgentResponse(`Agent says: ${agentInput}`);
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
  <div className="max-w-4xl mx-auto p-4 relative pb-32" style={{ overflowY: 'hidden' }}>
      <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-card-custom">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
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
              {/* Validate Quest button removed */}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border/50">
            <p className="text-sm leading-relaxed">{quest.description}</p>
          </div>

          {/* Code Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-quest-primary" />
                <h3 className="font-semibold">Code Implementation</h3>
                <Badge variant="secondary">{quest.language}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(quest.codeSnippet)}
                  className="hover:border-quest-primary/50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                {quest.validationEndpoint && (
                  <Dialog open={isApiPlaygroundOpen} onOpenChange={setIsApiPlaygroundOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="bg-gradient-primary">
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
                )}
              </div>
            </div>
            <div className="relative">
              <pre
                className="bg-secondary/50 p-4 rounded-lg overflow-x-auto overflow-y-auto text-sm border border-border/50 max-h-64"
                style={{ maxHeight: '16rem' }}
              >
                <code>{quest.codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Expected Output */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-quest-success" />
              Expected Output
            </h3>
            <div className="bg-quest-success/10 border border-quest-success/20 p-4 rounded-lg">
              <pre className="text-sm text-quest-success whitespace-pre-wrap">
                {quest.expectedOutput}
              </pre>
            </div>
          </div>
        </div>
      </Card>
      {/* Sticky Agent Input */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <div className="max-w-4xl w-full px-4 pb-4 pointer-events-auto">
          <div className="bg-gradient-card border-2 border-quest-primary shadow-card-custom rounded-xl p-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 text-base shadow-sm bg-background text-white placeholder:text-muted-foreground"
                placeholder="Ask the agent about this quest..."
                value={agentInput}
                onChange={e => setAgentInput(e.target.value)}
                disabled={isAgentLoading}
              />
              <Button
                onClick={handleAskAgent}
                disabled={!agentInput.trim() || isAgentLoading}
                className="bg-gradient-primary flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {isAgentLoading ? "Asking..." : "Ask Agent"}
              </Button>
            </div>
            {agentResponse && (
              <div className="text-left text-sm bg-secondary/30 p-3 rounded-lg border border-border/50">
                <span className="font-semibold text-quest-primary">Agent:</span> {agentResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;