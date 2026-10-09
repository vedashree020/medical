// Priority badge variant mapping
export function priorityVariant(priority) {
  const map = {
    Emergency: 'emergency',
    Urgent: 'urgent',
    Routine: 'routine',
  };
  return map[priority] || 'default';
}

export function statusVariant(status) {
  const map = {
    Confirmed: 'confirmed',
    Scheduled: 'scheduled',
    Available: 'available',
    Completed: 'confirmed',
  };
  return map[status] || 'default';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
