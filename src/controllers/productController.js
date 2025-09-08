import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchProducts = async (req, res) => {
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

    const filters = {
      where: {
        AND: [
          handle ? { handle: { contains: handle, mode: "insensitive" } } : {},
          category ? { category: { name: { contains: category, mode: "insensitive" } } } : {},
          brand ? { brand: { name: { contains: brand, mode: "insensitive" } } } : {},
          minRating || maxRating
            ? {
                review: {
                  rating: {
                    gte: minRating ? Number(minRating) : undefined,
                    lte: maxRating ? Number(maxRating) : undefined,
                  },
                },
              }
            : {},
          minPrice || maxPrice
            ? {
                variants: {
                  some: {
                    price: {
                      gte: minPrice ? Number(minPrice) : undefined,
                      lte: maxPrice ? Number(maxPrice) : undefined,
                    },
                  },
                },
              }
            : {},
          variantOption
            ? {
                variants: {
                  some: {
                    options: {
                      some: {
                        value: { contains: variantOption, mode: "insensitive" },
                      },
                    },
                  },
                },
              }
            : {},
        ],
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        category: true,
        brand: true,
        review: true,
        variants: { include: { options: true } },
      },
    };

    const products = await prisma.product.findMany(filters);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
