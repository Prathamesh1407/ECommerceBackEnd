const slugify = require("slugify");
const Category = require("../models/CategoryModel");
const fs = require("fs");
exports.createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).json({
        success: true,
        message: "Category Already Exists",
      });
    }

    const categoryDetails = await Category.create({
      name,
      slug: slugify(name),
    });
    return res.status(201).json({
      success: true,
      message: "Category Successfully created",
      categoryDetails,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err,
    });
  }
};

exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res.status(404).json({
        success: false,
        message: "Category Name is required",
      });
    }
    const updateCategoryDetails = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Category Updated Successfully",
      updateCategoryDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: err,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({});
    return res.status(201).json({
      success: true,
      message: "Category Successfully Displayed",
      allCategories,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const singleCategory = await Category.find({ slug });
    return res.status(201).json({
      success: true,
      message: "Single Category Successfully Displayed",
      singleCategory,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "error while displaying single Category",
      err,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategoryDetails = await Category.findByIdAndDelete(id);
    return res.status(201).json({
      success: true,
      message: "Category Successfully Deleted",
      deleteCategoryDetails,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "error while deleting single Category",
      err,
    });
  }
};
