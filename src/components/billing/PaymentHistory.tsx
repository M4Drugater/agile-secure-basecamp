
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export function PaymentHistory() {
  const { user } = useAuth();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payment-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment History
        </CardTitle>
        <CardDescription>
          View your recent payment transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center p-3 rounded border">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : payments && payments.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 rounded border hover:bg-muted/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">
                        {payment.currency?.toUpperCase()} {Number(payment.amount).toFixed(2)}
                      </span>
                      <Badge variant={getStatusColor(payment.status)} size="sm">
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                    {payment.description && (
                      <p className="text-xs text-muted-foreground">{payment.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{payment.payment_method || 'Card'}</p>
                    {payment.stripe_invoice_id && (
                      <p className="text-xs text-muted-foreground">
                        Invoice #{payment.stripe_invoice_id.slice(-8)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No payment history found</p>
            <p className="text-sm">Your payment transactions will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
