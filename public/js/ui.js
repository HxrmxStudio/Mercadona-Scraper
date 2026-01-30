/**
 * UI Module - Handles all DOM manipulation
 */

/** @typedef {import('./state.js').Product} Product */

/**
 * DOM element cache for performance
 */
const elements = {
  /** @type {HTMLButtonElement|null} */
  startBtn: null,
  /** @type {HTMLButtonElement|null} */
  stopBtn: null,
  /** @type {HTMLButtonElement|null} */
  exportBtn: null,
  /** @type {HTMLElement|null} */
  statusContainer: null,
  /** @type {HTMLElement|null} */
  statusMessage: null,
  /** @type {HTMLElement|null} */
  progressBar: null,
  /** @type {HTMLElement|null} */
  totalProducts: null,
  /** @type {HTMLElement|null} */
  totalCategories: null,
  /** @type {HTMLElement|null} */
  avgPrice: null,
  /** @type {HTMLTableSectionElement|null} */
  productsBody: null,
  /** @type {HTMLInputElement|null} */
  postalCode: null,
  /** @type {HTMLSelectElement|null} */
  categoryFilter: null,
  /** @type {HTMLInputElement|null} */
  searchBox: null
};

/**
 * Initialize DOM element references
 */
export function initUI() {
  elements.startBtn = /** @type {HTMLButtonElement} */ (document.getElementById('startBtn'));
  elements.stopBtn = /** @type {HTMLButtonElement} */ (document.getElementById('stopBtn'));
  elements.exportBtn = /** @type {HTMLButtonElement} */ (document.getElementById('exportBtn'));
  elements.statusContainer = document.getElementById('statusContainer');
  elements.statusMessage = document.getElementById('statusMessage');
  elements.progressBar = document.getElementById('progressBar');
  elements.totalProducts = document.getElementById('totalProducts');
  elements.totalCategories = document.getElementById('totalCategories');
  elements.avgPrice = document.getElementById('avgPrice');
  elements.productsBody = /** @type {HTMLTableSectionElement} */ (document.getElementById('productsBody'));
  elements.postalCode = /** @type {HTMLInputElement} */ (document.getElementById('postalCode'));
  elements.categoryFilter = /** @type {HTMLSelectElement} */ (document.getElementById('categoryFilter'));
  elements.searchBox = /** @type {HTMLInputElement} */ (document.getElementById('searchBox'));
}

/**
 * Get input values from form
 * @returns {{postalCode: string, categoryFilter: string}}
 */
export function getInputValues() {
  return {
    postalCode: elements.postalCode?.value || '08001',
    categoryFilter: elements.categoryFilter?.value || ''
  };
}

/**
 * Update status message and progress bar
 * @param {'info'|'success'|'error'} type
 * @param {string} message
 * @param {number} [progress]
 */
export function updateStatus(type, message, progress) {
  if (!elements.statusMessage) return;
  
  elements.statusMessage.className = `status-message ${type}`;
  const icon = type === 'info' ? '<span class="spinner"></span>' : '';
  elements.statusMessage.innerHTML = `${icon} <span>${message}</span>`;

  if (progress !== undefined && elements.progressBar) {
    elements.progressBar.style.width = `${progress}%`;
  }
}

/**
 * Show/hide status container
 * @param {boolean} visible
 */
export function showStatusContainer(visible) {
  if (elements.statusContainer) {
    elements.statusContainer.style.display = visible ? 'block' : 'none';
  }
}

/**
 * Set button states for scraping mode
 * @param {boolean} isRunning
 */
export function setScrapingMode(isRunning) {
  if (elements.startBtn) elements.startBtn.disabled = isRunning;
  if (elements.stopBtn) elements.stopBtn.disabled = !isRunning;
  if (elements.exportBtn) elements.exportBtn.disabled = isRunning;
}

/**
 * Enable export button
 */
export function enableExport() {
  if (elements.exportBtn) elements.exportBtn.disabled = false;
}

/**
 * Update statistics display
 * @param {Product[]} products
 */
export function updateStats(products) {
  if (elements.totalProducts) {
    elements.totalProducts.textContent = String(products.length);
  }
  
  if (elements.totalCategories) {
    const uniqueCategories = new Set(products.map(p => p.category));
    elements.totalCategories.textContent = String(uniqueCategories.size);
  }

  if (elements.avgPrice && products.length > 0) {
    const avgPrice = products.reduce((sum, p) => sum + parseFloat(p.bulkPrice || '0'), 0) / products.length;
    elements.avgPrice.textContent = avgPrice.toFixed(2) + '€';
  }
}

/**
 * Clear products table
 */
export function clearTable() {
  if (elements.productsBody) {
    elements.productsBody.innerHTML = '';
  }
}

/**
 * Add a product row to the table
 * @param {Product} product
 * @param {boolean} isFirst
 */
export function addProductToTable(product, isFirst = false) {
  if (!elements.productsBody) return;
  
  if (isFirst) {
    elements.productsBody.innerHTML = '';
  }

  const row = elements.productsBody.insertRow(0);
  const escapedName = escapeHtml(product.name);
  const escapedCategory = escapeHtml(product.category);
  
  row.innerHTML = `
    <td>${product.id}</td>
    <td><img src="${product.thumbnail}" alt="${escapedName}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23ddd%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'"></td>
    <td><strong>${escapedName}</strong></td>
    <td><span class="category-badge">${escapedCategory}</span></td>
    <td class="price">${product.bulkPrice}€</td>
    <td>${product.referencePrice}€/${product.referenceFormat}</td>
    <td>${product.unitSize} ${product.sizeFormat}</td>
    <td>${product.available}</td>
  `;
}

/**
 * Filter table rows by search term
 * @param {string} searchTerm
 */
export function filterTable(searchTerm) {
  const rows = document.querySelectorAll('#productsBody tr');
  const term = searchTerm.toLowerCase();

  rows.forEach(row => {
    const text = row.textContent?.toLowerCase() || '';
    /** @type {HTMLElement} */ (row).style.display = text.includes(term) ? '' : 'none';
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
