import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, Target, Send } from "lucide-react";
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
import axios from "axios";

const PEGA_API_BASE_URL = import.meta.env.VITE_PEGA_API_BASE_URL;

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

type Message = {
  sender: "user" | "agent";
  content: string;
  showApiButton?: boolean;
  suggestions?: string[];
  apiConfig?: {
    IsAPIToBeCalledReady?: boolean;
    API_URL?: string;
    API_method?: string;
    BearerToken?: string | null;
    API_Payload?: {
      client_id?: string;
      client_secret?: string;
      grant_type?: string;
    };
  } | null;
  apiResponse?: any;
  apiError?: any;
};

const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startConversation = async () => {
      setIsAgentLoading(true);
      try {
        // Log initial setup and environment
        console.log('=== Starting Conversation Creation ===');
        console.log('Environment Check:', {
          PEGA_API_BASE_URL,
          'import.meta.env.VITE_PEGA_API_BASE_URL': import.meta.env.VITE_PEGA_API_BASE_URL
        });

        // Conversation creation request
        const completeUrl = `${PEGA_API_BASE_URL}/api/application/v2/ai-agents/@BASECLASS!APIAGENT/conversations`;
        console.log('API Call 1 - Create Conversation:', {
          url: completeUrl,
          method: 'POST'
        });

        const response = await axios.post(completeUrl);
        console.log('API Call 1 - Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        
        const conversationID  = response.data.ID;
        console.log('Extracted conversationID:', conversationID);
        setConversationId(conversationID);
        
        // Welcome message request
        const welcomeUrl = `${PEGA_API_BASE_URL}/api/application/v2/ai-agents/@BASECLASS!APIAGENT/conversations/${conversationID}`;
        console.log('API Call 2 - Send Welcome Message:', {
          url: welcomeUrl,
          method: 'PATCH',
          data: { Request: "start" }
        });

        const welcomeResponse = await axios.patch(welcomeUrl, {
          Request: "start"
        });
        console.log('API Call 2 - Response:', {
          status: welcomeResponse.status,
          statusText: welcomeResponse.statusText,
          data: welcomeResponse.data
        });
        
        setConversation([
          {
            sender: "agent",
            content: welcomeResponse.data.response
          },
        ]);
      } catch (error) {
        console.log('=== Error in Conversation Setup ===');
        if (axios.isAxiosError(error)) {
          // Log the request that failed
          console.log('Failed Request Details:', {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            headers: error.config?.headers
          });

          // Log the error response
          console.log('Error Response:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          });

          // Log network error if any
          if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
            console.log('Network Error:', {
              code: error.code,
              message: error.message
            });
          }

          // Full error object for complete debugging
          console.log('Complete Error Object:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            code: error.code
          });
        } else {
          console.log('Unexpected Error:', {
            error: error,
            type: typeof error,
            stack: error instanceof Error ? error.stack : 'No stack trace'
          });
        }
        
        // Log current environment state
        console.log('Environment State:', {
          PEGA_API_BASE_URL,
          'import.meta.env.VITE_PEGA_API_BASE_URL': import.meta.env.VITE_PEGA_API_BASE_URL,
          'Current conversationId': conversationId
        });
        toast({
          title: "Error",
          description: "Could not connect to the agent. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsAgentLoading(false);
      }
    };

    startConversation();
  }, [quest, toast]);

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

    if (!conversationId) {
        setIsAgentLoading(false);
        toast({
          title: "Connection Error",
          description: "Lost connection to the agent. Please refresh the page.",
          variant: "destructive",
        });
        return;
    }

    try {
      const messageUrl = `${PEGA_API_BASE_URL}/api/application/v2/ai-agents/@BASECLASS!APIAGENT/conversations/${conversationId}`;
      console.log('Sending message to:', messageUrl);
      
      const response = await axios.patch(messageUrl, {
        Request: text,
      });
      console.log('Message response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      // Parse the response to check for API call information
      const responseText = response.data.response;
      let apiConfig = null;
      let showApiButton = false;
      
      // Try to extract JSON from the response if it exists
      try {
        // Look for any JSON content between ``` markers
        const jsonBlocks = responseText.match(/```json\s*({[\s\S]*?})\s*```/g);
        
        if (jsonBlocks) {
          // Test each JSON block found
          for (const block of jsonBlocks) {
            try {
              // Extract the JSON content between the markers
              const jsonContent = block.match(/```json\s*({[\s\S]*?})\s*```/)[1];
              const parsedConfig = JSON.parse(jsonContent);
              
              // Check if this JSON has the API config marker
              if (parsedConfig.IsAPIToBeCalledReady) {
                apiConfig = parsedConfig;
                showApiButton = true;
                console.log('Found valid API config:', apiConfig);
                break; // Stop after finding the first valid API config
              }
            } catch (jsonError) {
              console.log('Failed to parse JSON block:', block);
              continue; // Try next block if this one fails
            }
          }
        }
      } catch (error) {
        console.log('Error parsing API config:', error);
        console.log('Response text was:', responseText);
      }

      const agentResponse: Message = {
        sender: "agent",
        content: response.data.response,
        showApiButton: showApiButton,
        apiConfig: apiConfig // Add this to your Message type
      };
      setConversation(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message to the agent.",
        variant: "destructive",
      });
    } finally {
      setIsAgentLoading(false);
    }
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

  const handleValidationSuccess = async (response: any) => {
    console.log("Validation successful:", response);
    // Show success toast
    toast({
      title: "API Call Successful!",
      description: "The API request completed successfully.",
    });

    // Update the conversation message with the API response
    setConversation(prev => {
      const lastMsg = {...prev[prev.length - 1]};
      if (lastMsg.apiConfig) {
        lastMsg.apiResponse = response;
      }
      return [...prev.slice(0, -1), lastMsg];
    });

    // Send API response to agent
    if (conversationId) {
      try {
        const messageUrl = `${PEGA_API_BASE_URL}/api/application/v2/ai-agents/@BASECLASS!APIAGENT/conversations/${conversationId}`;
        await axios.patch(messageUrl, {
          Request: `API Response: ${JSON.stringify(response, null, 2)}`
        });
      } catch (error) {
        console.error("Error sending API response to agent:", error);
      }
    }
  };

  const handleValidationError = async (error: any) => {
    console.error("API call failed:", error);
    // Show error toast
    toast({
      title: "API Call Failed",
      description: error.message || "The API request failed.",
      variant: "destructive",
    });

    // Update the conversation message with the API error
    setConversation(prev => {
      const lastMsg = {...prev[prev.length - 1]};
      if (lastMsg.apiConfig) {
        lastMsg.apiError = error;
      }
      return [...prev.slice(0, -1), lastMsg];
    });

    // Send error to agent
    if (conversationId) {
      try {
        const messageUrl = `${PEGA_API_BASE_URL}/api/application/v2/ai-agents/@BASECLASS!APIAGENT/conversations/${conversationId}`;
        await axios.patch(messageUrl, {
          Request: `API Error: ${JSON.stringify({
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          }, null, 2)}`
        });
      } catch (sendError) {
        console.error("Error sending API error to agent:", sendError);
      }
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
        <ScrollArea className="flex-grow p-4 pb-24" ref={scrollAreaRef}>
          <div className="space-y-6">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'agent' && <AgentAvatar />}
                <div className={`max-w-md rounded-xl px-4 py-3 ${msg.sender === 'agent' ? 'bg-secondary/50' : 'bg-quest-primary/20'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.showApiButton && msg.apiConfig && (
                    <div className="mt-4">
                        <div className="relative bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm border border-border/50 max-h-64">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(JSON.stringify(msg.apiConfig, null, 2))}
                                className="absolute top-2 right-2 h-7 w-7"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            <pre><code>{JSON.stringify(msg.apiConfig, null, 2)}</code></pre>
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
                            <DialogTitle>API Playground - Token Generation</DialogTitle>
                          </DialogHeader>
                          <ApiPlayground
                            initialUrl={msg.apiConfig.API_URL}
                            initialMethod={msg.apiConfig.API_method?.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'}
                            initialHeaders={{
                              'Content-Type': 'application/json',
                              ...(msg.apiConfig.BearerToken && {
                                'Authorization': `Bearer ${msg.apiConfig.BearerToken}`
                              })
                            }}
                            initialBody={msg.apiConfig.API_Payload}
                            onSuccess={handleValidationSuccess}
                            onError={handleValidationError}
                          />
                          {/* Continue button section */}
                          {(msg.apiResponse || msg.apiError) && (
                            <div className="mt-4 flex justify-end">
                              <Button 
                                onClick={() => {
                                  setIsApiPlaygroundOpen(false);
                                  // Only update progress if API call was successful
                                  if (msg.apiResponse && !msg.apiError) {
                                    onComplete();
                                  }
                                }}
                                className="bg-gradient-primary"
                              >
                                Continue
                              </Button>
                            </div>
                          )}
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