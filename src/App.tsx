import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { QueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Page imports
import LandingPage from '@/pages/Landing';
import AuthForm from '@/components/auth/AuthForm';
import IndexPage from '@/pages/Index';
import ProfilePage from '@/pages/Profile';
import KnowledgeBasePage from '@/pages/KnowledgeBase';
import ContentGeneratorPage from '@/pages/ContentGenerator';
import ContentLibraryPage from '@/pages/ContentLibrary';
import ChatPage from '@/pages/Chat';
import EnhancedChatPage from '@/pages/EnhancedChat';
import AssistedModelPage from '@/pages/AssistedModel';
import LearningManagementPage from '@/pages/LearningManagement';
import ResearchWorkbenchPage from '@/pages/ResearchWorkbench';
import OptimizedResearchWorkbenchPage from '@/pages/OptimizedResearchWorkbench';
import CompetitiveIntelligencePage from '@/pages/CompetitiveIntelligence';
import CDVDiscoveryPage from '@/pages/CDVDiscovery';
import TrendsDiscoveryPage from '@/pages/TrendsDiscovery';
import ContentAnalyticsPage from '@/pages/ContentAnalytics';
import BillingPage from '@/pages/Billing';
import AdminPage from '@/pages/Admin';
import NotFoundPage from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <QueryClient>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <IndexPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/knowledge" element={
              <ProtectedRoute>
                <KnowledgeBasePage />
              </ProtectedRoute>
            } />
            <Route path="/content-generator" element={
              <ProtectedRoute>
                <ContentGeneratorPage />
              </ProtectedRoute>
            } />
            <Route path="/content-library" element={
              <ProtectedRoute>
                <ContentLibraryPage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/enhanced-chat" element={
              <ProtectedRoute>
                <EnhancedChatPage />
              </ProtectedRoute>
            } />
            <Route path="/assisted-model" element={
              <ProtectedRoute>
                <AssistedModelPage />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/research" element={
              <ProtectedRoute>
                <ResearchWorkbenchPage />
              </ProtectedRoute>
            } />
            <Route path="/optimized-research" element={
              <ProtectedRoute>
                <OptimizedResearchWorkbenchPage />
              </ProtectedRoute>
            } />
            <Route path="/competitive-intelligence" element={
              <ProtectedRoute>
                <CompetitiveIntelligencePage />
              </ProtectedRoute>
            } />
            <Route path="/cdv-discovery" element={
              <ProtectedRoute>
                <CDVDiscoveryPage />
              </ProtectedRoute>
            } />
            <Route path="/trends" element={
              <ProtectedRoute>
                <TrendsDiscoveryPage />
              </ProtectedRoute>
            } />
            <Route path="/content-analytics" element={
              <ProtectedRoute>
                <ContentAnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </QueryClient>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
