
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Unlock, Crown } from 'lucide-react';
import { ProgressNotification } from '@/hooks/journey/useProgressNotifications';

interface ProgressNotificationsProps {
  notifications: ProgressNotification[];
  onRemove: (id: string) => void;
}

const NOTIFICATION_ICONS = {
  step_completed: CheckCircle,
  module_unlocked: Unlock,
  journey_complete: Crown
};

const NOTIFICATION_COLORS = {
  step_completed: 'from-green-500 to-emerald-600',
  module_unlocked: 'from-blue-500 to-indigo-600',
  journey_complete: 'from-purple-500 to-pink-600'
};

export function ProgressNotifications({ notifications, onRemove }: ProgressNotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = NOTIFICATION_ICONS[notification.type];
          const colorClass = NOTIFICATION_COLORS[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Card className="relative overflow-hidden border-2 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-10`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {notification.type === 'step_completed' && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            ¡Completado!
                          </Badge>
                        )}
                        {notification.type === 'module_unlocked' && (
                          <Badge className="text-xs px-1.5 py-0 bg-blue-500">
                            Desbloqueado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(notification.id)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
