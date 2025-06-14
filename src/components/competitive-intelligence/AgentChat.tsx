
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  User,
  BarChart3,
  FileText,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  messageType?: 'text' | 'analysis' | 'report' | 'insight';
}

interface AgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function AgentChat({ agentId, sessionConfig }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const agentPersonalities = {
    cdv: {
      name: 'CDV',
      welcomeMessage: 'Hello! I\'m CDV, your Data Visualization specialist. I excel at transforming complex competitive data into clear, actionable visual insights. Ready to create some compelling charts and analysis?',
      responseStyle: 'analytical and data-focused'
    },
    cia: {
      name: 'CIA',
      welcomeMessage: 'Greetings! I\'m CIA, your Intelligence Analysis expert. I specialize in strategic analysis, threat assessment, and competitive intelligence gathering. Let\'s uncover some strategic insights!',
      responseStyle: 'strategic and intelligence-focused'
    },
    cir: {
      name: 'CIR',
      welcomeMessage: 'Welcome! I\'m CIR, your Reporting specialist. I focus on creating actionable reports and strategic recommendations that drive business decisions. Ready to generate some impactful insights?',
      responseStyle: 'executive and action-oriented'
    }
  };

  useEffect(() => {
    // Initialize with welcome message
    const agent = agentPersonalities[agentId as keyof typeof agentPersonalities];
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: agent.welcomeMessage,
      timestamp: new Date(),
      messageType: 'text'
    };
    setMessages([welcomeMessage]);
  }, [agentId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAgentResponse = (userInput: string, agentId: string): string => {
    const { companyName, industry, analysisFocus } = sessionConfig;
    
    const responses = {
      cdv: [
        `Based on your request about ${companyName || 'the target company'}, I can create several data visualizations. Would you like me to generate:

• **Market Share Analysis** - Competitive positioning chart
• **Performance Trends** - Historical data visualization  
• **Feature Comparison** - Product/service benchmarking chart
• **Pricing Analysis** - Competitive pricing landscape

Which visualization would be most valuable for your ${analysisFocus || 'analysis'}?`,

        `Excellent! For ${industry || 'this industry'} analysis, I recommend starting with a comprehensive data visualization approach:

📊 **Available Visualization Types:**
- Bubble charts for market positioning
- Trend lines for performance tracking
- Heat maps for competitive intensity
- Scatter plots for correlation analysis

Let me know what specific data points you'd like me to visualize, and I'll create compelling charts that reveal competitive insights.`
      ],
      cia: [
        `Analyzing ${companyName || 'the target company'} from a strategic intelligence perspective. Here's my initial assessment framework:

🎯 **Intelligence Gathering Areas:**
• Market positioning and strategic moves
• Competitive threats and opportunities  
• Financial performance indicators
• Innovation and R&D investments

For ${industry || 'this sector'}, I'd recommend focusing on ${analysisFocus || 'key strategic elements'}. What specific intelligence areas would you like me to investigate first?`,

        `From an intelligence analysis standpoint, I'm seeing several strategic patterns in ${industry || 'this market'}. Here's what I recommend investigating:

🔍 **Priority Intelligence Requirements:**
- Competitive response patterns
- Market entry/exit strategies
- Partnership and acquisition activities
- Technology adoption trends

Would you like me to conduct a deep-dive analysis on any of these areas?`
      ],
      cir: [
        `Perfect! I'll prepare a comprehensive report on ${companyName || 'your target company'}. Here's my reporting framework:

📋 **Report Structure:**
• **Executive Summary** - Key findings and implications
• **Strategic Recommendations** - Actionable next steps
• **Competitive Landscape** - Market positioning analysis
• **Risk Assessment** - Potential threats and opportunities

For ${analysisFocus || 'your focus area'}, I recommend prioritizing actionable insights that drive immediate business value. What's your primary decision-making timeline?`,

        `Excellent! I'm structuring a strategic report that will provide clear, actionable insights for ${industry || 'your industry'}:

📊 **Key Report Sections:**
- Current competitive position
- Strategic recommendations (short & long-term)
- Market opportunity assessment
- Implementation roadmap

This report will be designed for executive decision-making. Would you like me to emphasize any particular strategic angle?`
      ]
    };

    const agentResponses = responses[agentId as keyof typeof responses];
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const assistantResponse = generateAgentResponse(inputValue, agentId);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        messageType: 'analysis'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const agent = agentPersonalities[agentId as keyof typeof agentPersonalities];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-blue-600" />
          Chat with {agent.name}
          <Badge variant="outline" className="ml-auto">
            <TrendingUp className="h-3 w-3 mr-1" />
            Intelligence Mode
          </Badge>
        </CardTitle>
        {sessionConfig.companyName && (
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">Target: {sessionConfig.companyName}</Badge>
            {sessionConfig.industry && <Badge variant="outline">{sessionConfig.industry}</Badge>}
            {sessionConfig.analysisFocus && <Badge variant="outline">{sessionConfig.analysisFocus}</Badge>}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      {getMessageTypeIcon(message.messageType)}
                      <span className="text-xs font-medium opacity-70">
                        {agent.name} • {message.messageType || 'response'}
                      </span>
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/•/g, '•')
                          .replace(/📊|🎯|🔍|📋/g, '')
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 animate-pulse" />
                    <span>{agent.name} is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${agent.name} for competitive intelligence...`}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
