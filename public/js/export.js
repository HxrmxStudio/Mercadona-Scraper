/**
 * Export Module - Handles CSV export functionality
 */

/** @typedef {import('./state.js').Product} Product */

/**
 * Export products to CSV file
 * @param {Product[]} products
 * @returns {boolean} Success status
 */
export function exportToCSV(products) {
  if (products.length === 0) {
    alert('No hay productos para exportar');
    return false;
  }

  const headers = [
    'ID',
    'Nombre',
    'Categoría',
    'Precio Unidad',
    'Precio Bulto',
    'Precio Referencia',
    'Formato Referencia',
    'Tamaño',
    'Formato Tamaño',
    'Empaquetado',
    'Disponible',
    'IVA',
    'Imagen URL'
  ];

  const csvContent = [
    headers.join(';'),
    ...products.map(p => formatProductRow(p))
  ].join('\n');

  downloadCSV(csvContent);
  return true;
}

/**
 * Format a product as a CSV row
 * @param {Product} product
 * @returns {string}
 */
function formatProductRow(product) {
  return [
    product.id,
    escapeCSV(product.name),
    escapeCSV(product.category),
    product.price,
    product.bulkPrice,
    product.referencePrice,
    product.referenceFormat,
    product.unitSize,
    product.sizeFormat,
    escapeCSV(product.packaging),
    product.available,
    product.iva,
    product.thumbnail
  ].join(';');
}

/**
 * Escape a value for CSV (handle quotes and special chars)
 * @param {string} value
 * @returns {string}
 */
function escapeCSV(value) {
  if (!value) return '""';
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Trigger CSV file download
 * @param {string} content
 */
function downloadCSV(content) {
  const BOM = '\ufeff'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const fecha = new Date().toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `mercadona_productos_${fecha}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
