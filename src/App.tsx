
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import KnowledgeBase from './pages/KnowledgeBase';
import ContentGenerator from './pages/ContentGenerator';
import ContentLibrary from './pages/ContentLibrary';
import RedditTrendsPage from './pages/RedditTrendsPage';
import OnboardingPage from './pages/OnboardingPage';
import ProgressiveDashboard from './components/journey/ProgressiveDashboard';
import Chat from './pages/Chat';
import CompetitiveIntelligence from './pages/CompetitiveIntelligence';
import EnhancedFeatures from '@/pages/EnhancedFeatures';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/content-generator" element={<ContentGenerator />} />
            <Route path="/content-library" element={<ContentLibrary />} />
            <Route path="/reddit-trends" element={<RedditTrendsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<ProgressiveDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/competitive-intelligence" element={<CompetitiveIntelligence />} />
            <Route path="/enhanced" element={<EnhancedFeatures />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
