
import React from 'react';
import { DashboardIcon } from './DashboardIcon';

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
        <DashboardIcon />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
