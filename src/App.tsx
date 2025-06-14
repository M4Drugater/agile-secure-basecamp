
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import AssistedModel from "./pages/AssistedModel";
import ContentGenerator from "./pages/ContentGenerator";
import ContentLibrary from "./pages/ContentLibrary";
import ContentAnalytics from "./pages/ContentAnalytics";
import KnowledgeBase from "./pages/KnowledgeBase";
import LearningManagement from "./pages/LearningManagement";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import TrendsDiscovery from "./pages/TrendsDiscovery";
import ResearchWorkbench from "./pages/ResearchWorkbench";
import CompetitiveIntelligence from "./pages/CompetitiveIntelligence";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/modelo-asistido" element={
                <ProtectedRoute>
                  <AssistedModel />
                </ProtectedRoute>
              } />
              <Route path="/content/generator" element={
                <ProtectedRoute>
                  <ContentGenerator />
                </ProtectedRoute>
              } />
              <Route path="/content/library" element={
                <ProtectedRoute>
                  <ContentLibrary />
                </ProtectedRoute>
              } />
              <Route path="/content/analytics" element={
                <ProtectedRoute>
                  <ContentAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              <Route path="/learning" element={
                <ProtectedRoute>
                  <LearningManagement />
                </ProtectedRoute>
              } />
              <Route path="/trends" element={
                <ProtectedRoute>
                  <TrendsDiscovery />
                </ProtectedRoute>
              } />
              <Route path="/research" element={
                <ProtectedRoute>
                  <ResearchWorkbench />
                </ProtectedRoute>
              } />
              <Route path="/competitive-intelligence" element={
                <ProtectedRoute>
                  <CompetitiveIntelligence />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
