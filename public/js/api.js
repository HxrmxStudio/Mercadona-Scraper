/**
 * API Service - Handles all Mercadona API communications
 */

const BASE_URL = '/api/mercadona';

/**
 * Fetch all categories from Mercadona
 * @param {string} postalCode
 * @returns {Promise<Array<{id: number, name: string, categories?: Array}>>}
 */
export async function fetchCategories(postalCode) {
  const url = `${BASE_URL}/categories/?lang=es&wh=${postalCode}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('No se pudieron obtener las categorías. Verifica el código postal.');
  }
  
  const data = await response.json();
  return data.results || [];
}

/**
 * Fetch products for a specific category
 * @param {number|string} categoryId
 * @param {string} postalCode
 * @returns {Promise<{categories?: Array}|null>}
 */
export async function fetchCategoryProducts(categoryId, postalCode) {
  const url = `${BASE_URL}/categories/${categoryId}?lang=es&wh=${postalCode}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    console.warn(`No se pudo obtener la categoría ${categoryId}`);
    return null;
  }
  
  return response.json();
}

/**
 * Small delay to avoid overloading the API
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
