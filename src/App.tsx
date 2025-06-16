
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsolidatedAppLayout } from "@/components/layout/ConsolidatedAppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import OnboardingFlow from "@/components/journey/OnboardingFlow";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes with layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <Dashboard />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingFlow />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <Chat />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <ConsolidatedAgents />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <Profile />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/content" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <ContentGenerator />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <KnowledgeBase />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/research" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <OptimizedResearchWorkbench />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/learning" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <LearningManagement />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/billing" element={
                <ProtectedRoute>
                  <ConsolidatedAppLayout>
                    <Billing />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <ConsolidatedAppLayout>
                    <Admin />
                  </ConsolidatedAppLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect legacy routes to unified systems */}
              <Route path="/content-library" element={<Navigate to="/content?tab=library" replace />} />
              <Route path="/content-generator" element={<Navigate to="/content?tab=generator" replace />} />
              <Route path="/content-analytics" element={<Navigate to="/content?tab=library" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
