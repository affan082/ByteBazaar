exports.ProductQuery = {
  keyword: String,
  price: {
    min: Number,
    max: Number,
  },
  rating: {
    min: Number,
    max: Number,
  },
  categories: [String],
  brands: [String],
  inStock: Boolean,
};
