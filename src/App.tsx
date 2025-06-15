
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsolidatedAppLayout } from "@/components/layout/ConsolidatedAppLayout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ContentGenerator from "./pages/ContentGenerator";
import KnowledgeBase from "./pages/KnowledgeBase";
import OptimizedResearchWorkbench from "./pages/OptimizedResearchWorkbench";
import LearningManagement from "./pages/LearningManagement";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import ConsolidatedAgents from "./pages/ConsolidatedAgents";

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
                <Route path="/agents" element={<ConsolidatedAgents />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/content" element={<ContentGenerator />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/research" element={<OptimizedResearchWorkbench />} />
                <Route path="/learning" element={<LearningManagement />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/admin" element={<Admin />} />
                {/* Redirect legacy routes to unified content studio */}
                <Route path="/content-library" element={<Navigate to="/content?tab=library" replace />} />
                <Route path="/content-generator" element={<Navigate to="/content?tab=generator" replace />} />
                <Route path="/content-analytics" element={<Navigate to="/content?tab=library" replace />} />
              </Routes>
            </ConsolidatedAppLayout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
