
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Signup';
import DashboardPage from '@/pages/Dashboard';
import ProfilePage from '@/pages/Profile';
import KnowledgePage from '@/pages/KnowledgeBase';
import ContentPage from '@/pages/Content';
import LearningPage from '@/pages/LearningManagement';
import ChatPage from '@/pages/Chat';
import EnhancedChatPage from '@/pages/EnhancedChat';
import UnifiedChatPage from '@/pages/UnifiedChatPage';
import AgentsPage from '@/pages/Agents';

// Component to handle competitive intelligence route redirection
function CompetitiveIntelligenceRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab') || 'workspace';
  const agent = urlParams.get('agent') || 'cdv';
  
  // Construct the new URL with preserved parameters
  const redirectUrl = `/agents?tab=${tab}&agent=${agent}`;
  
  console.log('🔧 SISTEMA REPARADO - Redirigiendo desde competitive-intelligence a:', redirectUrl);
  
  return <Navigate to={redirectUrl} replace />;
}

function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/knowledge" element={
              <ProtectedRoute>
                <KnowledgePage />
              </ProtectedRoute>
            } />
            <Route path="/content" element={
              <ProtectedRoute>
                <ContentPage />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            } />
            
            {/* Chat routes - unified system */}
            <Route path="/chat" element={
              <ProtectedRoute>
                <UnifiedChatPage />
              </ProtectedRoute>
            } />
            
            {/* Enhanced chat as alternative */}
            <Route path="/enhanced-chat" element={
              <ProtectedRoute>
                <EnhancedChatPage />
              </ProtectedRoute>
            } />
            
            {/* 🔧 SISTEMA REPARADO - Unified Agents workspace with all functionality */}
            <Route path="/agents" element={
              <ProtectedRoute>
                <AgentsPage />
              </ProtectedRoute>
            } />
            
            {/* 🔧 SISTEMA REPARADO - Redirect legacy competitive intelligence route */}
            <Route path="/competitive-intelligence" element={
              <ProtectedRoute>
                <CompetitiveIntelligenceRedirect />
              </ProtectedRoute>
            } />
            
            {/* Additional legacy redirects for system repair */}
            <Route path="/unified-agents" element={
              <ProtectedRoute>
                <Navigate to="/agents" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;
