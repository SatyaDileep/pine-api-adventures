import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface ProgressTrackerProps {
  currentQuest: number;
  totalQuests: number;
  xpEarned: number;
  totalXp: number;
  badges: string[];
  language: string;
}

const ProgressTracker = ({ 
  currentQuest, 
  totalQuests, 
  xpEarned, 
  totalXp,
  badges,
  language 
}: ProgressTrackerProps) => {
  const progressPercentage = (currentQuest / totalQuests) * 100;
  const xpPercentage = (xpEarned / totalXp) * 100;

  const getBadgeInfo = (badgeId: string) => {
    const badgeMap: Record<string, { icon: React.ReactNode; color: string; name: string }> = {
      'first-steps': { icon: <Target className="w-4 h-4" />, color: 'bg-quest-success', name: 'First Steps' },
      'code-warrior': { icon: <Zap className="w-4 h-4" />, color: 'bg-quest-primary', name: 'Code Warrior' },
      'api-master': { icon: <Star className="w-4 h-4" />, color: 'bg-quest-legendary', name: 'API Master' },
      'speed-runner': { icon: <Trophy className="w-4 h-4" />, color: 'bg-quest-xp', name: 'Speed Runner' },
    };
    return badgeMap[badgeId] || { icon: <Star className="w-4 h-4" />, color: 'bg-muted', name: 'Unknown' };
  };

  return (
    <div className="fixed top-4 right-4 w-80 z-50">
      <Card className="bg-gradient-card border-border/50 shadow-card-custom">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Progress</h3>
            <Badge variant="outline" className="border-quest-primary text-quest-primary">
              {language}
            </Badge>
          </div>

          {/* Quest Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Quest Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuest}/{totalQuests}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-secondary/50"
            />
          </div>

          {/* XP Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-quest-xp" />
                <span className="text-sm font-medium">Experience</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {xpEarned}/{totalXp} XP
              </span>
            </div>
            <Progress 
              value={xpPercentage} 
              className="h-2 bg-secondary/50"
            />
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-quest-xp" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {badges.map((badgeId) => {
                const badge = getBadgeInfo(badgeId);
                return (
                  <div 
                    key={badgeId}
                    className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg border border-border/50"
                  >
                    <div className={`w-6 h-6 ${badge.color} rounded-full flex items-center justify-center text-white`}>
                      {badge.icon}
                    </div>
                    <span className="text-xs font-medium truncate">
                      {badge.name}
                    </span>
                  </div>
                );
              })}
              
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - badges.length) }).map((_, index) => (
                <div 
                  key={`empty-${index}`}
                  className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg border border-dashed border-border/30"
                >
                  <div className="w-6 h-6 bg-muted/30 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                  <span className="text-xs text-muted-foreground/50">
                    Locked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracker;