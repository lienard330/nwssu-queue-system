// Demo mode - no actual file generation
export function exportPDF() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
}

export function exportCSV(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
}

export function printReport() {
  window.print();
}
