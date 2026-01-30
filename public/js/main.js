/**
 * Main Entry Point - Mercadona Product Scraper
 * Orchestrates the scraping process and UI interactions
 */

import { fetchCategories, fetchCategoryProducts, delay } from './api.js';
import { getProducts, addProduct, updateState, resetState, shouldStop, isRunning } from './state.js';
import { initUI, getInputValues, updateStatus, showStatusContainer, setScrapingMode, enableExport, updateStats, addProductToTable, filterTable } from './ui.js';
import { exportToCSV } from './export.js';

/**
 * Start the scraping process
 */
async function startScraping() {
  if (isRunning()) return;

  resetState();
  updateState({ isRunning: true });
  setScrapingMode(true);
  showStatusContainer(true);

  const { postalCode, categoryFilter } = getInputValues();

  try {
    updateStatus('info', '🔍 Obteniendo categorías principales...', 0);

    const categories = await fetchCategories(postalCode);
    updateStatus('info', `✅ ${categories.length} categorías encontradas. Extrayendo productos...`, 10);

    let processedCategories = 0;
    const totalCategories = categories.length;

    for (const category of categories) {
      if (shouldStop()) break;

      // Skip if filter is set and doesn't match
      if (categoryFilter && category.id.toString() !== categoryFilter) {
        continue;
      }

      const progress = 10 + (processedCategories / totalCategories) * 90;
      updateStatus('info', `📦 Procesando: ${category.name} (${processedCategories + 1}/${totalCategories})`, progress);

      await processCategory(category, postalCode);
      processedCategories++;
      updateStats(getProducts());
    }

    if (!shouldStop()) {
      const products = getProducts();
      updateStatus('success', `🎉 ¡Extracción completada! ${products.length} productos extraídos.`, 100);
      enableExport();
    } else {
      updateStatus('info', '⏸️ Extracción detenida por el usuario.', 0);
    }
  } catch (error) {
    console.error('Error:', error);
    updateStatus('error', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
  } finally {
    updateState({ isRunning: false });
    setScrapingMode(false);
  }
}

/**
 * Process a category and its subcategories
 * @param {{id: number, name: string, categories?: Array<any>}} category
 * @param {string} postalCode
 * @param {string} [parentName='']
 */
async function processCategory(category, postalCode, parentName = '') {
  if (shouldStop()) return;

  try {
    const categoryName = parentName ? `${parentName} > ${category.name}` : category.name;

    if (category.categories && category.categories.length > 0) {
      for (const subCategory of category.categories) {
        if (shouldStop()) break;

        const subCategoryData = await fetchCategoryProducts(subCategory.id, postalCode);

        if (subCategoryData?.categories) {
          for (const cat of subCategoryData.categories) {
            if (cat.products && cat.products.length > 0) {
              for (const product of cat.products) {
                addProductFromAPI(product, `${categoryName} > ${subCategory.name}`);
              }
            }
          }
        }

        await delay(200);
      }
    }
  } catch (error) {
    console.error(`Error procesando categoría ${category.name}:`, error);
  }
}

/**
 * Transform API product to our format and add to state
 * @param {any} product - Raw product from API
 * @param {string} categoryName
 */
function addProductFromAPI(product, categoryName) {
  const products = getProducts();
  const isFirst = products.length === 0;

  /** @type {import('./state.js').Product} */
  const productData = {
    id: product.id,
    name: product.display_name || product.name,
    category: categoryName,
    price: product.price_instructions?.unit_price || '0',
    bulkPrice: product.price_instructions?.bulk_price || '0',
    referencePrice: product.price_instructions?.reference_price || '0',
    referenceFormat: product.price_instructions?.reference_format || '',
    sizeFormat: product.price_instructions?.size_format || '',
    unitSize: product.price_instructions?.unit_size || '',
    thumbnail: product.thumbnail || '',
    packaging: product.packaging || '',
    available: product.unavailable_from ? 'No' : 'Sí',
    iva: product.price_instructions?.iva || 0
  };

  addProduct(productData);
  addProductToTable(productData, isFirst);
}

/**
 * Stop the scraping process
 */
function stopScraping() {
  updateState({ shouldStop: true });
  updateStatus('info', '⏸️ Deteniendo extracción...', 0);
}

/**
 * Export current data to CSV
 */
function exportData() {
  const products = getProducts();
  if (exportToCSV(products)) {
    updateStatus('success', `✅ Archivo CSV exportado con ${products.length} productos`, 100);
  }
}

/**
 * Handle search input
 */
function handleSearch() {
  const searchBox = /** @type {HTMLInputElement} */ (document.getElementById('searchBox'));
  filterTable(searchBox?.value || '');
}

/**
 * Initialize the application
 */
function init() {
  initUI();

  // Bind event handlers
  document.getElementById('startBtn')?.addEventListener('click', startScraping);
  document.getElementById('stopBtn')?.addEventListener('click', stopScraping);
  document.getElementById('exportBtn')?.addEventListener('click', exportData);
  document.getElementById('searchBox')?.addEventListener('keyup', handleSearch);
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
