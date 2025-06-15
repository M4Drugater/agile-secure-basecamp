
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Users, 
  Target, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

interface CompletionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  completionResults: any;
  agentCount: number;
}

export function CompletionResultsModal({ 
  isOpen, 
  onClose, 
  completionResults,
  agentCount 
}: CompletionResultsModalProps) {
  if (!completionResults) return null;

  const handleDownloadReport = (reportType: string, reportData: any) => {
    const content = `# ${reportData.title}\n\n${reportData.content}\n\nGenerado: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            🎉 ¡Sesión Colaborativa Completada!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen de Finalización */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Análisis Colaborativo Exitoso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{agentCount}</div>
                  <div className="text-sm text-muted-foreground">Agentes Colaboraron</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(completionResults.agentOutputs).length + 3}
                  </div>
                  <div className="text-sm text-muted-foreground">Reportes Generados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-muted-foreground">Sesión Completada</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados en Tabs */}
          <Tabs defaultValue="final-report" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="final-report">Reporte Final</TabsTrigger>
              <TabsTrigger value="agent-outputs">Outputs por Agente</TabsTrigger>
              <TabsTrigger value="synthesis">Síntesis</TabsTrigger>
              <TabsTrigger value="action-plan">Plan de Acción</TabsTrigger>
            </TabsList>

            <TabsContent value="final-report" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reporte Ejecutivo Final
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReport('reporte-final', completionResults.finalReport)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Reporte integral que sintetiza todas las perspectivas y análisis de los agentes colaboradores.
                      </p>
                      <div className="space-y-2">
                        {completionResults.finalReport.insights_generated?.map((insight: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <Badge variant="secondary" className="mt-1">{index + 1}</Badge>
                            <span className="text-sm">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agent-outputs" className="space-y-4">
              <div className="grid gap-4">
                {Object.entries(completionResults.agentOutputs).map(([agentId, output]: [string, any]) => (
                  <Card key={agentId}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <Users className="h-5 w-5" />
                        Agente {agentId.toUpperCase()}
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(`agente-${agentId}`, output)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline">{output.output_type}</Badge>
                        <p className="text-sm text-muted-foreground">{output.title}</p>
                        <div className="text-xs">
                          Insights generados: {output.insights_generated?.length || 0}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="synthesis" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Síntesis Colaborativa
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReport('sintesis', completionResults.synthesisReport)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Integración de todas las perspectivas de agentes en un análisis cohesivo.
                      </p>
                      <div className="space-y-2">
                        {completionResults.synthesisReport.insights_generated?.map((insight: string, index: number) => (
                          <div key={index} className="p-3 bg-muted rounded">
                            <span className="text-sm">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="action-plan" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Plan de Acción Ejecutivo
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReport('plan-accion', completionResults.actionPlan)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Acciones concretas y timeline para implementar las recomendaciones estratégicas.
                      </p>
                      <div className="space-y-3">
                        {completionResults.actionPlan.action_items?.map((action: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded">
                            <Badge variant="default">{index + 1}</Badge>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{action.title || action}</div>
                              {action.priority && (
                                <Badge variant="secondary" className="mt-1">
                                  {action.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Información de Finalización */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Completado: {new Date(completionResults.completedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button onClick={() => handleDownloadReport('reporte-completo', completionResults.finalReport)}>
                    Descargar Todo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
