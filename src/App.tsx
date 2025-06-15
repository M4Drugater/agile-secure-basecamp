
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import CompetitiveIntelligencePage from '@/pages/CompetitiveIntelligence';
import EnhancedChatPage from '@/pages/EnhancedChat';
import UnifiedChatPage from '@/pages/UnifiedChatPage';

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
            
            {/* Updated chat route to use unified system */}
            <Route path="/chat" element={
              <ProtectedRoute>
                <UnifiedChatPage />
              </ProtectedRoute>
            } />
            
            {/* Keep enhanced chat as alternative */}
            <Route path="/enhanced-chat" element={
              <ProtectedRoute>
                <EnhancedChatPage />
              </ProtectedRoute>
            } />
            
            <Route path="/competitive-intelligence" element={
              <ProtectedRoute>
                <CompetitiveIntelligencePage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;
