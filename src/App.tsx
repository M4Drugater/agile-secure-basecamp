
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { TourProvider } from "./contexts/TourContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UniversalLayout } from "./layouts/UniversalLayout";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import KnowledgeBase from "./pages/KnowledgeBase";
import ContentGenerator from "./pages/ContentGenerator";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import LearningManagement from "./pages/LearningManagement";
import ConsolidatedAgents from "./pages/ConsolidatedAgents";
import OptimizedResearchWorkbench from "./pages/OptimizedResearchWorkbench";
import OnboardingPage from "./pages/OnboardingPage";

import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <TourProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected routes wrapped in UniversalLayout */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <Dashboard />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <OnboardingPage />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <Chat />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <Profile />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/knowledge" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <KnowledgeBase />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/content-generator" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <ContentGenerator />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/competitive-intelligence" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <ConsolidatedAgents />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/research" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <OptimizedResearchWorkbench />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/learning" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <LearningManagement />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <Billing />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <UniversalLayout>
                        <Admin />
                      </UniversalLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect any unknown routes to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TourProvider>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
