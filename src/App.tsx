
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsolidatedAppLayout } from "@/components/layout/ConsolidatedAppLayout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ContentGenerator from "./pages/ContentGenerator";
import LaigentOrchestrator from "./pages/LaigentOrchestrator";
import KnowledgeBase from "./pages/KnowledgeBase";
import OptimizedResearchWorkbench from "./pages/OptimizedResearchWorkbench";
import UnifiedAgents from "./pages/UnifiedAgents";
import LearningManagement from "./pages/LearningManagement";
import Billing from "./pages/Billing";
import ContentLibrary from "./pages/ContentLibrary";
import ContentAnalytics from "./pages/ContentAnalytics";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <ConsolidatedAppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/agents" element={<UnifiedAgents />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/content" element={<ContentGenerator />} />
                <Route path="/content-library" element={<ContentLibrary />} />
                <Route path="/content-analytics" element={<ContentAnalytics />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/research" element={<OptimizedResearchWorkbench />} />
                <Route path="/competitive-intelligence" element={<UnifiedAgents />} />
                <Route path="/learning" element={<LearningManagement />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/laigent-orchestrator" element={<LaigentOrchestrator />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </ConsolidatedAppLayout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
