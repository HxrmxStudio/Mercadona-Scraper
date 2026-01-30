/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} price
 * @property {string} bulkPrice
 * @property {string} referencePrice
 * @property {string} referenceFormat
 * @property {string} sizeFormat
 * @property {string} unitSize
 * @property {string} thumbnail
 * @property {string} packaging
 * @property {string} available
 * @property {number} iva
 */

/**
 * @typedef {Object} AppState
 * @property {Product[]} products
 * @property {boolean} isRunning
 * @property {boolean} shouldStop
 */

/** @type {AppState} */
const state = {
  products: [],
  isRunning: false,
  shouldStop: false
};

/**
 * Get current state (read-only copy)
 * @returns {AppState}
 */
export function getState() {
  return { ...state };
}

/**
 * Get products array reference (for mutations during scraping)
 * @returns {Product[]}
 */
export function getProducts() {
  return state.products;
}

/**
 * Add a product to state
 * @param {Product} product
 */
export function addProduct(product) {
  state.products.push(product);
}

/**
 * Update state properties
 * @param {Partial<AppState>} updates
 */
export function updateState(updates) {
  Object.assign(state, updates);
}

/**
 * Reset state to initial values
 */
export function resetState() {
  state.products = [];
  state.isRunning = false;
  state.shouldStop = false;
}

/**
 * Check if scraping should stop
 * @returns {boolean}
 */
export function shouldStop() {
  return state.shouldStop;
}

/**
 * Check if scraping is running
 * @returns {boolean}
 */
export function isRunning() {
  return state.isRunning;
}
