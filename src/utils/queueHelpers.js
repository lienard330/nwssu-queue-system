export function generateQueueNumber(prefix, nextSeq = 1) {
  const padded = String(nextSeq).padStart(3, '0');
  return `${prefix}-${padded}`;
}

export function getServicePrefix(serviceId) {
  const map = { EN: 'EN', CL: 'CL', TR: 'TR', IP: 'IP' };
  return map[serviceId] || serviceId;
}
