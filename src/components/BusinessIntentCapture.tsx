import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Sparkles, ArrowRight, CreditCard, RefreshCw, Calendar } from "lucide-react";

interface BusinessIntentCaptureProps {
  onIntentSubmit: (intent: string) => void;
}

const suggestedIntents = [
  {
    text: "Collect one-time payments from customers",
    icon: CreditCard,
    category: "Payment Collection"
  },
  {
    text: "Implement refunds and cancellations",
    icon: RefreshCw,
    category: "Refund Management"
  },
  {
    text: "Set up recurring subscription billing",
    icon: Calendar,
    category: "Subscriptions"
  },
  {
    text: "Accept payments through mobile apps",
    icon: CreditCard,
    category: "Mobile Payments"
  },
  {
    text: "Process bulk payout transactions",
    icon: ArrowRight,
    category: "Payouts"
  },
  {
    text: "Integrate payment gateway with e-commerce",
    icon: CreditCard,
    category: "E-commerce"
  }
];

const BusinessIntentCapture = ({ onIntentSubmit }: BusinessIntentCaptureProps) => {
  const [intent, setIntent] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSubmit = () => {
    const finalIntent = selectedSuggestion || intent;
    if (finalIntent.trim()) {
      onIntentSubmit(finalIntent);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setIntent(suggestion);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full mb-6">
            <Target className="w-5 h-5" />
            <span className="font-semibold">Integration Quest</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            What's Your Goal?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us what you're trying to achieve with Pine Labs Online APIs. 
            We'll create a personalized integration journey just for you.
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50 shadow-card-custom p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-lg font-semibold mb-3 block">
                Describe your integration goal:
              </label>
              <Textarea
                value={intent}
                onChange={(e) => {
                  setIntent(e.target.value);
                  setSelectedSuggestion(null);
                }}
                placeholder="Example: I want to collect payments for my online store and handle refunds automatically..."
                className="min-h-[120px] text-base"
              />
            </div>

            <div className="text-center">
              <span className="text-muted-foreground">or choose from popular use cases:</span>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {suggestedIntents.map((suggestion, index) => {
                const Icon = suggestion.icon;
                const isSelected = selectedSuggestion === suggestion.text;
                
                return (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'bg-quest-primary/10 border-quest-primary/50' 
                        : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{suggestion.text}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {suggestion.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!intent.trim()}
              className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create My Integration Quest
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>

        <div className="text-center text-muted-foreground">
          <div className="inline-flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-quest-success rounded-full" />
              <span className="text-sm">Personalized Journey</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-quest-xp rounded-full" />
              <span className="text-sm">Step-by-Step Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-quest-legendary rounded-full" />
              <span className="text-sm">Ready-to-Use Code</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntentCapture;