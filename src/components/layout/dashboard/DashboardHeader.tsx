
import React from 'react';
import { Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ 
  userName = "Usuario", 
  title = "Bienvenido a LAIGENT",
  subtitle = "Tu plataforma de desarrollo profesional con IA"
}: DashboardHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
