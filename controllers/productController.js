const Product = require("../models/ProductModel");
const slugify = require("slugify");
const fs = require("fs");
const Category = require("../models/CategoryModel");
exports.createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !quantity || !category) {
      return res.status(404).json({
        success: false,
        message: "All fields are manadatory",
      });
    }
    if (photo && photo.size > 1000000) {
      return res.status(401).json({
        success: false,
        message: "Upload photo that is less than 1Mb",
      });
    }
    const productDetails = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      productDetails.photo.data = fs.readFileSync(photo.path);
      productDetails.photo.contentType = photo.type;
    }
    await productDetails.save();
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      productDetails,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Creating the Product",
      err,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProductDetails = await Product.find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      totalCount: allProductDetails.length,
      allProductDetails,
      message: "Fetched All products Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Fetching the all Products",
      err,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const singleProductDetail = await Product.findOne({ slug })
      .select("-photo")
      .populate("category");
    return res.status(200).json({
      success: true,
      product: singleProductDetail,
      message: "Fetched the Product Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Fetching the Product",
      err,
    });
  }
};

exports.productPhotoController = async (req, res) => {
  try {
    const productPhotoDetail = await Product.findById(req.params.pid).select(
      "photo"
    );
    if (productPhotoDetail.photo.data) {
      res.set("Content-type", productPhotoDetail.photo.contentType);
      return res.status(200).send(productPhotoDetail.photo.data);
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Fetching the Product Photo",
      err,
    });
  }
};

exports.deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.pid
    ).select("-photo");
    return res.status(200).json({
      success: true,
      message: "Deleted the Product Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Deleting the Product",
      err,
    });
  }
};

exports.updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !quantity || !category) {
      return res.status(404).json({
        success: false,
        message: "All fields are manadatory",
      });
    }
    if (photo && photo.size > 1000000) {
      return res.status(401).json({
        success: false,
        message: "Uploaded photo must be less than 1Mb",
      });
    }
    const productDetails = await Product.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      productDetails.photo.data = fs.readFileSync(photo.path);
      productDetails.photo.contentType = photo.type;
    }
    await productDetails.save();
    return res.status(201).json({
      success: true,
      message: "Product Updated Successfully",
      productDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error while updating the Product",
      error: err.message,
    });
  }
};

exports.productFiltersController = async (req, res) => {
  try {
    // const perPage = 3;
    // const page = req.params.page ? req.params.page : 1;
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    // .select("-photo")
    // .skip((page - 1) * perPage)
    // .limit(perPage)
    // .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Filtered Successfully",
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error while Filtering the Product",
      error: err.message,
    });
  }
};

exports.productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    return res.status(200).json({
      success: true,
      message: "Count Successfully Calculated",
      total,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error while Counting the Product",
      error: err.message,
    });
  }
};

exports.productListController = async (req, res) => {
  try {
    // const perPage = 3;
    // const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({});
    // .select("-photo")
    // .skip((page - 1) * perPage)
    // .limit(perPage)
    // .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error while Getting the Product by Pagination",
      error: err.message,
    });
  }
};

exports.productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error while Getting the Product on Searching",
      error: err.message,
    });
  }
};

exports.similarProductController = async (req, res) => {
  try {
    const {pid,cid}=req.params;
    const products=await Product.find({
      category:cid,
      _id:{$ne:pid}
    }).select("-photo").limit(3).populate("category");
    return res.status(200).json({
      success:true,
      products,
    })
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      success: false,
      message: "Error while Getting the Related Product",
      error: err.message,
    });
  }
};

exports.getProductsByCategory=async(req,res)=>{
  try{
    const {slug}=req.params;
    const category=await Category.findOne({slug});
    const products=await Product.find({category}).select("-photo").populate("category")
    return res.status(200).json({
      success:true,
      products,
      category
    })
  }catch(err)
  {
    console.log(err)
    return res.status(401).json({
      success: false,
      message: "Error while Getting the Product By Category",
      error: err.message,
    });

  }
}
