import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, Check, AlertCircle, Target, Code2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuestCardProps {
  quest: {
    id: string;
    title: string;
    objective: string;
    description: string;
    codeSnippet: string;
    expectedOutput: string;
    xpReward: number;
    difficulty: "Easy" | "Medium" | "Hard";
    language: string;
  };
  onComplete: () => void;
  onValidate: () => Promise<boolean>;
}

const QuestCard = ({ quest, onComplete, onValidate }: QuestCardProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();

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

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationResult(null);
    
    try {
      const isValid = await onValidate();
      setValidationResult(isValid ? 'success' : 'error');
      
      if (isValid) {
        toast({
          title: "Quest Complete! 🎉",
          description: `You earned ${quest.xpReward} XP!`,
          duration: 3000,
        });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        toast({
          title: "Quest Failed",
          description: "Check your implementation and try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      setValidationResult('error');
      toast({
        title: "Validation Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsValidating(false);
    }
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
    <div className="max-w-4xl mx-auto p-4">
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
            <div className="flex items-center gap-2">
              <Badge className={`${getDifficultyColor(quest.difficulty)} text-white`}>
                {quest.difficulty}
              </Badge>
              <Badge variant="outline" className="border-quest-xp text-quest-xp">
                {quest.xpReward} XP
              </Badge>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(quest.codeSnippet)}
                className="hover:border-quest-primary/50"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm border border-border/50">
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

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex-1 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Validate Quest
                </>
              )}
            </Button>
            
            {validationResult === 'success' && (
              <div className="flex items-center gap-2 text-quest-success">
                <Check className="w-5 h-5" />
                <span className="font-medium">Success!</span>
              </div>
            )}
            
            {validationResult === 'error' && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Try Again</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestCard;