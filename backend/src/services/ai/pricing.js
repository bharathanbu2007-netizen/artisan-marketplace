/**
 * Dynamic Pricing Assistant — suggests a competitive price range based on
 * product characteristics, material cost estimate, and comparable products.
 * The artisan/manufacturer always retains final control over the selling price.
 */
async function suggestPrice({ category, material, rawMaterialEstimate = 0, comparableProducts = [] }) {
  // TODO: replace with a real model that looks at market trend data.
  const base = rawMaterialEstimate > 0 ? rawMaterialEstimate * 2.2 : 500;
  const min = Math.round(base * 0.9);
  const max = Math.round(base * 1.3);

  const similar = comparableProducts.length
    ? comparableProducts
    : [Math.round(base), Math.round(base * 1.05), Math.round(base * 1.1)];

  return {
    aiSuggestedMin: min,
    aiSuggestedMax: max,
    similarProducts: similar,
    rawMaterialEstimate,
    currency: 'INR',
  };
}

module.exports = { suggestPrice };
