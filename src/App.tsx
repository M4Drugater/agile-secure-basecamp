
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimplifiedAuthProvider } from "@/contexts/SimplifiedAuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ContentLibrary from "./pages/ContentLibrary";
import ContentGenerator from "./pages/ContentGenerator";
import LearningManagement from "./pages/LearningManagement";
import Admin from "./pages/Admin";
import KnowledgeBase from "./pages/KnowledgeBase";
import ContentAnalytics from "./pages/ContentAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SimplifiedAuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
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
                <Route path="/content" element={
                  <ProtectedRoute>
                    <ContentLibrary />
                  </ProtectedRoute>
                } />
                <Route path="/generate" element={
                  <ProtectedRoute>
                    <ContentGenerator />
                  </ProtectedRoute>
                } />
                <Route path="/learning" element={
                  <ProtectedRoute>
                    <LearningManagement />
                  </ProtectedRoute>
                } />
                <Route path="/knowledge" element={
                  <ProtectedRoute>
                    <KnowledgeBase />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <ContentAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SimplifiedAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
