import { useState } from "react";
import BusinessIntentCapture from "@/components/BusinessIntentCapture";
import LanguageSelector from "@/components/LanguageSelector";
import QuestCard from "@/components/QuestCard";
import ProgressTracker from "@/components/ProgressTracker";
import { questData } from "@/data/questData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, PartyPopper } from "lucide-react";

const Index = () => {
  const [businessIntent, setBusinessIntent] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  const currentQuests = selectedLanguage ? questData[selectedLanguage] || [] : [];
  const currentQuest = currentQuests[currentQuestIndex];
  const totalXp = currentQuests.reduce((sum, quest) => sum + quest.xpReward, 0);
  const isQuestComplete = currentQuestIndex >= currentQuests.length;

  const handleIntentSubmit = (intent: string) => {
    setBusinessIntent(intent);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentQuestIndex(0);
    setCompletedQuests([]);
    setXpEarned(0);
    setBadges(["first-steps"]);
  };

  const handleQuestComplete = () => {
    if (currentQuest) {
      setCompletedQuests(prev => [...prev, currentQuest.id]);
      setXpEarned(prev => prev + currentQuest.xpReward);
      
      // Award badges based on progress
      const newBadges = [...badges];
      if (currentQuestIndex === 1 && !newBadges.includes("code-warrior")) {
        newBadges.push("code-warrior");
      }
      if (currentQuestIndex === currentQuests.length - 1 && !newBadges.includes("api-master")) {
        newBadges.push("api-master");
      }
      setBadges(newBadges);
      
      setCurrentQuestIndex(prev => prev + 1);
    }
  };

  const handleQuestValidation = async (): Promise<boolean> => {
    // Simulate API validation with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, randomly succeed/fail
    // In real implementation, this would validate against Pine Labs API
    return Math.random() > 0.3; // 70% success rate for demo
  };

  const resetQuest = () => {
    setBusinessIntent("");
    setSelectedLanguage("");
    setCurrentQuestIndex(0);
    setCompletedQuests([]);
    setXpEarned(0);
    setBadges([]);
  };

  if (!businessIntent) {
    return <BusinessIntentCapture onIntentSubmit={handleIntentSubmit} />;
  }

  if (!selectedLanguage) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  if (isQuestComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-gradient-card border-border/50 shadow-card-custom text-center p-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-xp rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Quest Complete!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Congratulations! You've mastered Pine Labs Online API integration with {selectedLanguage}.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-quest-success">{completedQuests.length}</div>
              <div className="text-sm text-muted-foreground">Quests Completed</div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-quest-xp">{xpEarned}</div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold text-quest-legendary">{badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Unlocked</div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={resetQuest} variant="outline" size="lg">
              <Star className="w-4 h-4 mr-2" />
              Try Another Language
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90" size="lg">
              <PartyPopper className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {selectedLanguage && (
        <ProgressTracker
          currentQuest={currentQuestIndex}
          totalQuests={currentQuests.length}
          xpEarned={xpEarned}
          totalXp={totalXp}
          badges={badges}
          language={selectedLanguage}
        />
      )}
      
      <div className="pt-8 pb-16">
        {currentQuest && (
          <QuestCard
            quest={currentQuest}
            onComplete={handleQuestComplete}
            onValidate={handleQuestValidation}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
