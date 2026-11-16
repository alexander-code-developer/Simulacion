export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (decimal, decimals = 1) => {
  if (decimal === null || decimal === undefined || isNaN(decimal)) return '0%';
  return `${(decimal * 100).toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return Number(value).toFixed(decimals);
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};