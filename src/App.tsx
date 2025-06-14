
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import Home from '@/pages/Home';
import KnowledgeBase from '@/pages/KnowledgeBase';
import Agents from '@/pages/Agents';
import CompetitiveIntelligence from '@/pages/CompetitiveIntelligence';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UniversalLayout } from '@/layouts/UniversalLayout';
import Pricing from '@/pages/Pricing';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Chat from '@/pages/Chat';
import Content from '@/pages/Content';
import ContentGenerator from '@/pages/ContentGenerator';
import ContentLibrary from '@/pages/ContentLibrary';
import ContentAnalytics from '@/pages/ContentAnalytics';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Billing from '@/pages/Billing';
import TrendsDiscovery from '@/pages/TrendsDiscovery';
import ResearchWorkbench from '@/pages/ResearchWorkbench';
import LearningManagement from '@/pages/LearningManagement';

function App() {
  return (
    <AuthContextProvider>
      <QueryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Home />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Knowledge Base - Updated route */}
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <KnowledgeBase />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Legacy knowledge-base redirect for compatibility */}
              <Route path="/knowledge-base" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <KnowledgeBase />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* AI Modules */}
              <Route path="/agents" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Agents />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/competitive-intelligence" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <CompetitiveIntelligence />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/trends" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <TrendsDiscovery />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/research" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <ResearchWorkbench />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Chat */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Chat />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Content Routes - Organized properly */}
              <Route path="/content" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Content />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/content/generator" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <ContentGenerator />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/content/library" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <ContentLibrary />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/content/analytics" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <ContentAnalytics />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Learning Management */}
              <Route path="/learning" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <LearningManagement />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              
              {/* Account & Settings */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Profile />
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
              
              {/* Public Routes */}
              <Route path="/pricing" element={
                <UniversalLayout>
                  <Pricing />
                </UniversalLayout>
              } />
              
              <Route path="/terms" element={
                <UniversalLayout>
                  <Terms />
                </UniversalLayout>
              } />
              
              <Route path="/privacy" element={
                <UniversalLayout>
                  <Privacy />
                </UniversalLayout>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryProvider>
    </AuthContextProvider>
  );
}

export default App;
