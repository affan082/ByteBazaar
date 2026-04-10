const Product = require("../models/ProductSchema");
const APIResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");
const ErrorMessages = require("../config/ErrorMessages.json");
const {
  registerProductToStripe,
  deleteProductFromStripe,
  updateProductFromStripe,
} = require("./payment_controller");
const {User, SellerProfile} = require("../models/UserSchema");


exports.queryProducts = async (req, res) => {
  try {
    const query = {};
    let {
      _id,
      slug,
      keyword,
      price,
      rating,
      categories,
      brands,
      inStock,
      limit,
      skip,
      sort,
        seller
    } = req.body;

    if (price?.min != null || price?.max != null) {
      query.price = {};
      if (price.min) query.price.$gte = price.min;
      if (price.max) query.price.$lte = price.max;
    }

    if (rating?.min != null || rating?.max != null) {
      query.rating = {};
      if (rating.min) query.rating.$gte = rating.min;
      if (rating.max) query.rating.$lte = rating.max;
    }

    if (keyword && keyword.trim() !== "") {
      query.$text = { $search: keyword.trim() };
    }

    if (categories?.length > 0) {
      query.categories = categories;
    }

    if (brands?.length) {
      query.brand = { $in: brands };
    }

    if (inStock != null) {
      query.stock = inStock ? { $gte: 0 } : { $lte: 0 };
    }

    if (_id) query._id = _id;
    if (slug) query.slug = slug;

    if(seller) query.seller = seller;

    limit = limit || 0;
    skip = skip || 0;
    sort = sort || -1;

    const userId = req.user?.user?._id || req.user?._id;

    const user = await User.findById(userId).populate("roles");
    // console.log(user, "user");

    if (user && user.roles.some(r => r.name === "seller")) {
      query.seller = user._id;
      // console.log(query, "query");
    }



    const result = await Product.find(query)
        .populate("categories")
        .limit(limit)
        .skip(skip)
        .sort({ updatedAt: sort });

    if (result.length > 0) {
      return res
          .status(200)
          .send(new APIResponse(200, "Product(s) found", result));
    }

    return res
        .status(404)
        .send(new APIResponse(404, "Product(s) Not found", result));
  } catch (e) {
    res.status(500).send(
        new APIError(
            500,
            // "There was an Error Fetching Products.",
            e.message,
            ErrorMessages.ServerErrors.INTERNAL_ERROR,
            e
        )
    );
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = req.body;
    const user = req.user?.user || req.user;
    // console.log(user, "user")
    if (!user) {
      return res.status(401).send(new APIError(401, "Unauthorized"));
    }

    // Fetch user to get shop info
    let dbUser;
    let seller;
    try {
      dbUser = await User.findById(user._id).populate("roles");
      seller = await SellerProfile.findOne({user:user._id});
    }
    catch(e){
      return res.status(404).send(new APIError(404, "Seller not found"));
    }
    if (!dbUser) {
      return res.status(404).send(new APIError(404, "Seller not found"));
    }
    
    if (!dbUser.roles || !dbUser.roles.some(r => r.name === "seller")) {
      return res
          .status(403)
          .send(new APIError(403, "Only sellers can add products"));
    }
    if (seller.status !== "verified") {
  return res.status(403).send(
    new APIError(403, seller.status === "rejected" 
      ? "Your seller account has been rejected."
      : "Your seller account is pending admin approval."
    )
  );
}

    product.featureImage = req.files.find(
        (file) => file.fieldname === process.env.PRODUCT_FEATURE_IMAGE_FIELD
    )?.filename;

    product.gallery = req.files
        .filter((file) => file.fieldname === process.env.PRODUCT_GALLERY_IMAGE_FIELD)
        .map((file) => file.filename);

    product.categories =
        product.categories && product.categories !== ""
            ? product.categories.split(",")
            : null;

    product.seller = dbUser._id;
    product.shopName = seller.shopName || "Unknown Shop";

    let newProduct;
    try{
      newProduct = await Product.create(product);
    }
    catch(e){
      res.status(400).send(new APIError(409, e.message, ErrorMessages.ProductErrors.ADDITION_ERROR, e));
      return;
    }

    // Register product to Stripe
    let stripeProduct = await registerProductToStripe(newProduct);
    if (!stripeProduct || !Object.keys(stripeProduct).length) {
      await Product.deleteOne({ _id: newProduct._id });
      return res.status(500).send(
          new APIError(
              500,
              "Sorry, could not create Stripe Product.",
              ErrorMessages.StripeErrors.PRODUCT_CREATION_ERROR
          )
      );
    }

    const stripePriceId = stripeProduct.default_price.id;

    // Attach payment gateways
    const newPaymentGateways = product.paymentGateways || [];
    newPaymentGateways.push({
      gateway: "stripe",
      purchase_id: stripePriceId,
    });

    await Product.updateOne(
        { _id: newProduct._id },
        { paymentGateways: newPaymentGateways }
    );

    return res
        .status(200)
        .send(
            new APIResponse(200, "Product Added Successfully!", {
              id: newProduct._id,
            })
        );
  } catch (e) {
    console.error("Add Product Error:", e);
    res.status(500).send(
        new APIError(
            500,
            "Sorry, something went wrong",
            ErrorMessages.ProductErrors.ADDITION_ERROR,
            { reason: e }
        )
    );
  }
};


exports.getSingleProduct = async (req, res) => {
  const productID = req.query.id;
  if (!productID) {
    return res
        .status(403)
        .send(new APIError(403, "Please provide a valid Product ID."));
  }

  try {
    const product = await Product.findOne({ _id: productID });
    if (!product) {
      return res
          .status(404)
          .send(new APIError(404, "Product Not Found."));
    }
    res.status(200).send(product);
  } catch (e) {
    res
        .status(500)
        .send(new APIError(500, "Error fetching product", e.message));
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = req.body;
    // Bind images
    product.featureImage = req.files.find(
        (file) => file.fieldname === process.env.PRODUCT_FEATURE_IMAGE_FIELD
    )?.filename;

    product.gallery = req.files
        .filter((file) => file.fieldname === process.env.PRODUCT_GALLERY_IMAGE_FIELD)
        .map((file) => file.filename);

    // Split strings into arrays
    product.categories =
        product.categories !== "" ? product.categories.split(",") : null;

    //TODO Should Payment Gateway Update
    delete product.paymentGateways;

    const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        product
    );
    // console.log(product, "product");


    res
        .status(200)
        .send(
            new APIResponse(
                200,
                "Product has been Updated successfully.",
                { id: updatedProduct._id }
            )
        );
  } catch (e) {
    console.error("Update Product Error:", e);
    res.status(500).send(
        new APIError(
            500,
            e.message,
            ErrorMessages.ProductErrors.UPDATE_ERROR,
            e
        )
    );
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    
    const product = await Product.findOne({ _id: req.query.id });
    if (!product) {
      return res
          .status(404)
          .send(new APIError(404, "Product not found"));
    }

    if (product.selectedPaymentGateways && product.selectedPaymentGateways[0]?.purchase_id) {
      await deleteProductFromStripe(
          product.selectedPaymentGateways[0].purchase_id
      );
    }

    await Product.deleteOne({ _id: product._id });
    res
        .status(200)
        .send(new APIResponse(200, "Product Deleted Successfully."));
  } catch (e) {
    res.status(500).send(
        new APIError(
            500,
            e.message,
            ErrorMessages.ServerErrors.INTERNAL_ERROR,
            e
        )
    );
  }
};

