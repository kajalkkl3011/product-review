const products = [
  {
    id: 1,
    name: "iPhone 15",
    handle: "iphone-15",
    category: { id: 1, name: "Phones" },
    brand: { id: 1, name: "Apple" },
    review: { id: 1, rating: 5, comment: "Great phone!" },
    variants: [
      {
        id: 1,
        name: "128GB Black",
        price: 999,
        options: [{ id: 1, name: "Color", value: "Black" }],
      },
    ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    handle: "galaxy-s23",
    category: { id: 1, name: "Phones" },
    brand: { id: 2, name: "Samsung" },
    review: { id: 2, rating: 4, comment: "Solid Android device" },
    variants: [
      {
        id: 2,
        name: "256GB Silver",
        price: 899,
        options: [{ id: 2, name: "Color", value: "Silver" }],
      },
    ],
  },
];

export const searchProducts = (req, res) => {
  try {
    const {
      handle,
      category,
      brand,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      variantOption,
      page = 1,
      limit = 10,
    } = req.query;

    let results = [...products];

    // Filter by handle
    if (handle) {
      results = results.filter((p) =>
        p.handle.toLowerCase().includes(handle.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      results = results.filter((p) =>
        p.category.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by brand
    if (brand) {
      results = results.filter((p) =>
        p.brand.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Filter by rating
    if (minRating || maxRating) {
      results = results.filter((p) => {
        const rating = p.review?.rating || 0;
        return (
          (!minRating || rating >= Number(minRating)) &&
          (!maxRating || rating <= Number(maxRating))
        );
      });
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      results = results.filter((p) =>
        p.variants.some(
          (v) =>
            (!minPrice || v.price >= Number(minPrice)) &&
            (!maxPrice || v.price <= Number(maxPrice))
        )
      );
    }

    // Filter by variant option
    if (variantOption) {
      results = results.filter((p) =>
        p.variants.some((v) =>
          v.options.some((o) =>
            o.value.toLowerCase().includes(variantOption.toLowerCase())
          )
        )
      );
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;

    const paginatedResults = results.slice(start, end);

    res.json({
      page: pageNum,
      limit: limitNum,
      total: results.length,
      products: paginatedResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
