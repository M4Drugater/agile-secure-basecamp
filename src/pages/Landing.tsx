
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, FileText, BookOpen, Users, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Landing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to appropriate page
  useEffect(() => {
    if (user) {
      const profileCompleteness = profile?.profile_completeness || 0;
      if (profileCompleteness < 30) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, navigate]);

  if (user) return null; // Don't render while redirecting

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mentoring',
      description: 'Get personalized guidance from CLIPOGINO, our advanced AI mentor that understands your professional journey.'
    },
    {
      icon: FileText,
      title: 'Content Generation',
      description: 'Create professional resumes, cover letters, and LinkedIn content with intelligent AI assistance.'
    },
    {
      icon: BookOpen,
      title: 'Knowledge Management',
      description: 'Build and organize your professional knowledge base for continuous learning and growth.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold">LAIGENT</span>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl font-heading font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Elevate Your
              </span>
              <br />
              Professional Journey
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered professional development platform that transforms how you create content, 
              manage knowledge, and accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg rounded-xl backdrop-blur-md"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Powered by AI Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Advanced artificial intelligence meets professional development in a platform 
              designed for the modern professional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Ready to Transform Your Career?
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already using LAIGENT to accelerate 
              their career growth with AI-powered tools and insights.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started Today
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">
            © 2024 LAIGENT. Elevating professional development with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
