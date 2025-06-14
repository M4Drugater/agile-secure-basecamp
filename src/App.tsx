
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import Home from '@/pages/Home';
import KnowledgeBase from '@/pages/KnowledgeBase';
import Agents from '@/pages/Agents';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UniversalLayout } from '@/layouts/UniversalLayout';
import Pricing from '@/pages/Pricing';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Chat from '@/pages/Chat';
import Content from '@/pages/Content';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Billing from '@/pages/Billing';

function App() {
  return (
    <AuthContextProvider>
      <QueryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Home />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              <Route path="/knowledge-base" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <KnowledgeBase />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              <Route path="/agents" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Agents />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
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
              <Route path="/chat" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Chat />
                  </UniversalLayout>
                </ProtectedRoute>
              } />
              <Route path="/content" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Content />
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
              <Route path="/admin" element={
                <ProtectedRoute>
                  <UniversalLayout>
                    <Admin />
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
              
            </Routes>
          </div>
        </BrowserRouter>
      </QueryProvider>
    </AuthContextProvider>
  );
}

export default App;
