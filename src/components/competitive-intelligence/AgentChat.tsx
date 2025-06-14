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
  TrendingUp,
  Zap,
  Brain
} from 'lucide-react';
import { useAgentMessageHandling } from '@/hooks/competitive-intelligence/useAgentMessageHandling';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  messageType?: 'text' | 'analysis' | 'report' | 'insight';
  metadata?: any;
}

interface AgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
    sessionId?: string;
  };
}

export function AgentChat({ agentId, sessionConfig }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { sendMessageToAgent, isProcessing } = useAgentMessageHandling();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const agentPersonalities = {
    cdv: {
      name: 'CDV - Competitor Discovery & Validator',
      welcomeMessage: `Hello! I'm CDV, your Competitor Discovery & Validator specialist. I excel at discovering, analyzing, and validating competitive threats and opportunities in your market.

I can help you with:
• **Competitor Discovery**: Finding direct, indirect, and emerging competitors
• **Competitive Validation**: Verifying competitor capabilities and market positions  
• **Market Opportunity Analysis**: Identifying gaps and strategic opportunities
• **Threat Assessment**: Evaluating competitive risks and strategic implications

Based on your profile, I can see you're in ${sessionConfig.industry || 'your industry'}${sessionConfig.companyName ? ` and interested in analyzing ${sessionConfig.companyName}` : ''}. Let's discover and validate your competitive landscape!

What specific competitive intelligence would you like me to help you discover and validate?`,
      responseStyle: 'discovery and validation focused',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    cir: {
      name: '(CIR) COMPETITIVE INTELLIGENCE RETRIEVER',
      welcomeMessage: `Hello! I'm Marcus Rodriguez, your data intelligence specialist. I have access to comprehensive market databases and provide ACTUAL DATA and metrics, not instructions.

My specialized capabilities include:
• **Domain Authority Analysis**: Specific DA estimates for competitors
• **Traffic Intelligence**: Monthly visitor estimates and patterns
• **Social Media Metrics**: LinkedIn followers, engagement rates, posting frequency
• **Team Size Assessment**: Employee count estimates based on industry profiles
• **Content Analysis**: Volume assessment and content focus breakdown

I focus on providing specific numbers and ranges based on industry knowledge. I don't provide methodology - only concrete data and metrics.

${sessionConfig.companyName ? `Ready to analyze ${sessionConfig.companyName} and competitors` : 'Ready to analyze your competitive landscape'} with actual data estimates.

What specific market data do you need me to retrieve?`,
      responseStyle: 'data-focused and metrics-driven',
      icon: Target,
      color: 'text-green-600'
    },
    cia: {
      name: 'CIA - Intelligence Analysis',
      welcomeMessage: `Greetings! I'm CIA, your Competitive Intelligence Analysis expert. I specialize in strategic analysis, threat assessment, and transforming competitive data into actionable strategic insights.

My analytical capabilities include:
• **Strategic Analysis**: SWOT, Porter's Five Forces, strategic positioning
• **Threat Intelligence**: Competitive threat assessment and risk evaluation
• **Market Intelligence**: Industry dynamics and competitive trend analysis
• **Strategic Scenarios**: What-if analysis and strategic planning support

Given your background in ${sessionConfig.industry || 'your industry'}, I can provide deep strategic intelligence tailored to your market context and business objectives.

What strategic competitive intelligence questions can I analyze for you?`,
      responseStyle: 'strategic and intelligence-focused',
      icon: Brain,
      color: 'text-purple-600'
    }
  };

  useEffect(() => {
    // Initialize with personalized welcome message
    const agent = agentPersonalities[agentId as keyof typeof agentPersonalities];
    if (agent) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: agent.welcomeMessage,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [agentId, sessionConfig]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Send to enhanced agent system
      const assistantMessage = await sendMessageToAgent(
        inputValue,
        agentId,
        { ...sessionConfig, sessionId: sessionConfig.sessionId || `session_${Date.now()}` },
        messages
      );

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
        messageType: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
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

  const agent = agentPersonalities[agentId as key of typeof agentPersonalities];

  if (!agent) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-4" />
          <p>Agent not found. Please select a valid agent.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <agent.icon className={`h-5 w-5 ${agent.color}`} />
          Chat with {agent.name}
          <Badge variant="outline" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Enhanced AI
          </Badge>
        </CardTitle>
        {(sessionConfig.companyName || sessionConfig.industry || sessionConfig.analysisFocus) && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {sessionConfig.companyName && (
              <Badge variant="secondary">Target: {sessionConfig.companyName}</Badge>
            )}
            {sessionConfig.industry && (
              <Badge variant="outline">{sessionConfig.industry}</Badge>
            )}
            {sessionConfig.analysisFocus && (
              <Badge variant="outline">{sessionConfig.analysisFocus}</Badge>
            )}
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
                  className={`max-w-[85%] p-4 rounded-lg ${
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
                      {message.metadata?.cost && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          ${message.metadata.cost.toFixed(4)}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/•/g, '•')
                          .replace(/\n/g, '<br/>')
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
              placeholder={`Ask ${agent.name.split(' - ')[0]} for competitive intelligence...`}
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
          <p className="text-xs text-muted-foreground mt-2">
            Enhanced with your profile, knowledge base, and contextual intelligence
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
