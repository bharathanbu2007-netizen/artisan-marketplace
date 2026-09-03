/**
 * Dynamic pricing assistant.
 * Suggests a price automatically from category baselines, material cost hints,
 * and recent comparable listings, so sellers aren't required to price manually.
 */
const Product = require('../models/Product');

// Simple category multipliers as a starting heuristic; can be replaced with a
// trained model later without changing the calling contract.
const CATEGORY_MULTIPLIER = {
  textiles: 1.15,
  pottery: 1.2,
  jewelry: 1.35,
  woodwork: 1.25,
  painting: 1.4,
  default: 1.1,
};

async function suggestPrice({ category, basePrice, materials = [] }) {
  const multiplier = CATEGORY_MULTIPLIER[category?.toLowerCase()] || CATEGORY_MULTIPLIER.default;

  // Pull recent comparable active listings in the same category for a market anchor.
  const comparable = await Product.find({ category, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('price');

  let marketAnchor = null;
  if (comparable.length) {
    const avg = comparable.reduce((sum, p) => sum + p.price, 0) / comparable.length;
    marketAnchor = Math.round(avg);
  }

  const materialBump = materials.length > 2 ? 1.05 : 1;
  let suggested = Math.round(basePrice * multiplier * materialBump);

  // Blend with market anchor if we have one, weighting heuristic 60% / market 40%.
  if (marketAnchor) {
    suggested = Math.round(suggested * 0.6 + marketAnchor * 0.4);
  }

  return { suggestedPrice: suggested, marketAnchor };
}

module.exports = { suggestPrice };
