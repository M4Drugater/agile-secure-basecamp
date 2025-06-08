
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedFloatingButtons } from "@/components/ui/enhanced-floating-buttons";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ContentGenerator from "./pages/ContentGenerator";
import ContentLibrary from "./pages/ContentLibrary";
import ContentAnalytics from "./pages/ContentAnalytics";
import KnowledgeBase from "./pages/KnowledgeBase";
import LearningManagement from "./pages/LearningManagement";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useKeyboardNavigation();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/landing" element={<Landing />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/content-generator" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
        <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
        <Route path="/content-analytics" element={<ProtectedRoute><ContentAnalytics /></ProtectedRoute>} />
        <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><LearningManagement /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <EnhancedFloatingButtons />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
