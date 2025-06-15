
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Knowledge from "./pages/Knowledge";
import ContentGenerator from "./pages/ContentGenerator";
import CompetitiveIntelligence from "./pages/CompetitiveIntelligence";
import Research from "./pages/Research";
import LaigentOrchestrator from "./pages/LaigentOrchestrator";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/knowledge" element={<Knowledge />} />
                <Route path="/content" element={<ContentGenerator />} />
                <Route path="/competitive-intelligence" element={<CompetitiveIntelligence />} />
                <Route path="/research" element={<Research />} />
                <Route path="/laigent-orchestrator" element={<LaigentOrchestrator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
