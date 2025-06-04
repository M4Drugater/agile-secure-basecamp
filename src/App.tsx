
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FloatingHomeButton } from "@/components/ui/floating-home-button";
import { UniversalLayout } from "@/components/layout/UniversalLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import KnowledgeBase from "./pages/KnowledgeBase";
import ContentGeneratorPage from "./pages/ContentGenerator";
import ContentLibraryPage from "./pages/ContentLibrary";
import ContentAnalyticsPage from "./pages/ContentAnalytics";
import LearningManagement from "./pages/LearningManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component for pages that need UniversalLayout
const UniversalLayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <UniversalLayout>
    {children}
  </UniversalLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <Chat />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <Profile />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/knowledge-base" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <KnowledgeBase />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/content-generator" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <ContentGeneratorPage />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/content-library" element={
              <ProtectedRoute>
                <ContentLibraryPage />
              </ProtectedRoute>
            } />
            <Route path="/content-analytics" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <ContentAnalyticsPage />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <LearningManagement />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <UniversalLayoutWrapper>
                  <Admin />
                </UniversalLayoutWrapper>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={
              <UniversalLayoutWrapper>
                <NotFound />
              </UniversalLayoutWrapper>
            } />
          </Routes>
          <FloatingHomeButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
