import { useEffect, useState, useMemo } from "react";

// project import
import DataTable from "../../components/DataTable";

const ProductTable = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    // initialize AbortController for cleanup
    const abortController = new AbortController();
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetch(
          `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
          { signal: abortController.signal }
        );
        const json = await data.json();
        setProducts(json.products);
        setLoading(false);
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.error(`Error while fetching product data: ${e}`);
          setLoading(false);
        }
      }
    };
    getProducts();

    return function cleanup() {
      abortController.abort();
    };
  }, [skip]);

  // data fed to product table
  const columns = useMemo(() => {
    const headers = [
      "Product",
      "Description",
      "Price",
      "Discount",
      "Rating",
      "Stock",
      "Brand",
      "Category",
    ];
    const data = products
      ? products.map((product) => {
          return {
            ...product,
            id: {
              hidden: true,
              value: product.id,
            },
            title: {
              hidden: false,
              value: product.title,
            },
            description: {
              hidden: false,
              value: product.description,
            },
            price: {
              hidden: false,
              value: `€ ${product.price}.00`,
            },
            discountPercentage: {
              hidden: false,
              value: `${product.discountPercentage}%`,
            },
            rating: {
              hidden: false,
              value: `${product.rating}`,
            },
            stock: {
              hidden: false,
              value: product.stock,
            },
            brand: {
              hidden: false,
              value: product.brand,
            },
            category: {
              hidden: false,
              value: product.category,
            },
            thumbnail: {
              hidden: true,
              value: product.thumbnail,
            },
            images: {
              hidden: true,
              value: product.images,
            },
          };
        })
      : null;
    return { headers, data };
  }, [products]);

  const ProductTable = useMemo(() => {
    return (
      <DataTable
        minWidth="700px"
        headers={columns.headers}
        data={columns.data}
        loading={loading}
        pagination={{ skip, limit }}
      />
    );
  }, [loading, columns, skip, limit]);

  return ProductTable;
};

export default ProductTable;
