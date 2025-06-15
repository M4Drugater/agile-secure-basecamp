import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import KnowledgePage from '@/pages/KnowledgePage';
import ContentPage from '@/pages/ContentPage';
import LearningPage from '@/pages/LearningPage';
import ChatPage from '@/pages/ChatPage';
import CompetitiveIntelligencePage from '@/pages/CompetitiveIntelligencePage';
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
