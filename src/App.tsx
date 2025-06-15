
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Dashboard from '@/pages/Dashboard';
import KnowledgeBase from '@/pages/KnowledgeBase';
import UnifiedAgents from '@/pages/UnifiedAgents';
import Chat from '@/pages/Chat';
import Content from '@/pages/Content';
import ContentGenerator from '@/pages/ContentGenerator';
import ContentLibrary from '@/pages/ContentLibrary';
import ContentAnalytics from '@/pages/ContentAnalytics';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Billing from '@/pages/Billing';
import ResearchWorkbench from '@/pages/ResearchWorkbench';
import LearningManagement from '@/pages/LearningManagement';
import OnboardingPage from '@/pages/OnboardingPage';

function App() {
  return (
    <AuthContextProvider>
      <QueryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Main Dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Redirect legacy routes to main dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Onboarding */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              
              {/* Core Features */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              
              {/* AI Modules */}
              <Route path="/agents" element={
                <ProtectedRoute>
                  <UnifiedAgents />
                </ProtectedRoute>
              } />
              
              <Route path="/research" element={
                <ProtectedRoute>
                  <ResearchWorkbench />
                </ProtectedRoute>
              } />
              
              {/* Content Management */}
              <Route path="/content" element={
                <ProtectedRoute>
                  <Content />
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
              
              {/* Learning */}
              <Route path="/learning" element={
                <ProtectedRoute>
                  <LearningManagement />
                </ProtectedRoute>
              } />
              
              {/* Account & Admin */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryProvider>
    </AuthContextProvider>
  );
}

export default App;
