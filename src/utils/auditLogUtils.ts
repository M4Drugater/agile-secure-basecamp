
interface AuditLog {
  id: string;
  created_at: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  user_id: string | null;
  ip_address: unknown | null;
  details: unknown;
}

export const formatDetails = (details: unknown): string => {
  if (!details) return 'No details';
  
  if (typeof details === 'string') {
    return details;
  }
  
  if (typeof details === 'object' && details !== null) {
    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return 'Invalid object';
    }
  }
  
  return String(details);
};

export const exportAuditLogs = (auditLogs: AuditLog[]) => {
  const csvContent = [
    ['Timestamp', 'Action', 'Resource Type', 'Resource ID', 'User ID', 'IP Address', 'Details'].join(','),
    ...auditLogs.map(log => [
      log.created_at,
      log.action,
      log.resource_type,
      log.resource_id || '',
      log.user_id || '',
      log.ip_address ? String(log.ip_address) : '',
      formatDetails(log.details).replace(/"/g, '""')
    ].map(field => `"${field}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
  a.click();
  window.URL.revokeObjectURL(url);
};
