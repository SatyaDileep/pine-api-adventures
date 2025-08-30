import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Zap, Trophy } from "lucide-react";

interface Language {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
}

const languages: Language[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    description: "Perfect for beginners and rapid development",
    difficulty: "Beginner"
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: "🟢",
    description: "JavaScript runtime for scalable applications",
    difficulty: "Intermediate"
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    description: "Enterprise-grade language for robust systems",
    difficulty: "Advanced"
  }
];

const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full mb-6">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Integration Quest</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Begin your journey to master Pine Labs Online API integration. 
            Select your preferred programming language to unlock quest challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {languages.map((language) => (
            <Card 
              key={language.id}
              className="relative overflow-hidden bg-gradient-card border-border/50 hover:border-quest-primary/50 transition-all duration-300 hover:shadow-quest cursor-pointer group"
              onClick={() => onLanguageSelect(language.id)}
            >
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 group-hover:animate-float">
                  {language.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{language.name}</h3>
                <p className="text-muted-foreground mb-4">
                  {language.description}
                </p>
                <div className="inline-flex items-center gap-2 bg-quest-primary/10 text-quest-primary px-3 py-1 rounded-full text-sm mb-6">
                  <Zap className="w-4 h-4" />
                  {language.difficulty}
                </div>
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 group-hover:animate-pulse-glow"
                  size="lg"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Start Quest
                </Button>
              </div>
              
              {/* Animated border effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-quest-success rounded-full" />
              <span>Interactive Tutorials</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-quest-xp rounded-full" />
              <span>XP & Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-quest-legendary rounded-full" />
              <span>Real API Testing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;