
import React from 'react';

export function SyncInstructions() {
  return (
    <div className="text-xs text-muted-foreground">
      <strong>Esta acción reparará y configurará:</strong>
      <ul className="mt-1 ml-4 list-disc space-y-1">
        <li>Limpieza de datos de Stripe incorrectos en la base de datos</li>
        <li>Creación/verificación de productos en Stripe (Pro: €39/mes, Enterprise: €99/mes)</li>
        <li>Actualización de la base de datos con IDs de precio correctos de Stripe</li>
        <li>Inicialización de cuentas de créditos para todos los usuarios (100 créditos gratuitos)</li>
        <li>Configuración de precios de modelos de IA para cálculo de costos</li>
        <li>Verificación de que todas las configuraciones del sistema funcionen</li>
        <li>El plan Gratuito (€0/mes) no requiere configuración en Stripe</li>
      </ul>
      <div className="mt-2 p-2 bg-amber-50 rounded text-amber-800 border border-amber-200">
        <strong>Importante:</strong> Esta reparación limpiará los datos incorrectos y creará productos reales en tu cuenta de Stripe. Asegúrate de estar usando el entorno correcto (test/live).
      </div>
    </div>
  );
}
