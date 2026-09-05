const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return success(res, { categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description } = req.body;
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
  const category = await Category.create({ name, slug, icon, description });
  return success(res, { category }, 'Category created', 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return failure(res, 'Category not found', 404);
  return success(res, { category }, 'Category updated');
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) return failure(res, 'Category not found', 404);
  return success(res, {}, 'Category deactivated');
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
