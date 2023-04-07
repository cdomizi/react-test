import { useEffect, useState, useMemo } from "react";

// project import
import DataTable from "../../components/DataTable";

const ProductTable = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    // initialize AbortController for cleanup
    const abortController = new AbortController();
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetch(`https://dummyjson.com/products`, {
          signal: abortController.signal,
        });
        const json = await data.json();
        setProducts(json.products);
        setLoading(false);
      } catch (error) {
        // prevent logging errors on cleanup
        if (!abortController.signal.aborted) {
          console.error(
            `${error.status} - Error while fetching product data: ${error}`
          );
          setLoading(false);
        }
      }
    };
    getProducts();

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  // product table headers
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

    //product table data
    const data = products
      ? products.map((product) => {
          return {
            ...product,
            id: {
              label: "id",
              hidden: true,
              value: product.id,
            },
            title: {
              label: "title",
              hidden: false,
              value: product.title,
            },
            description: {
              label: "description",
              hidden: false,
              value: product.description,
            },
            price: {
              label: "price",
              hidden: false,
              value: `€\u00A0${product.price}.00`,
            },
            discountPercentage: {
              label: "discount",
              hidden: false,
              value: `${product.discountPercentage}%`,
            },
            rating: {
              label: "rating",
              hidden: false,
              value: `${product.rating}`,
            },
            stock: {
              label: "stock",
              hidden: false,
              value: product.stock,
            },
            brand: {
              label: "brand",
              hidden: false,
              value: product.brand,
            },
            category: {
              label: "category",
              hidden: false,
              value: product.category,
            },
            thumbnail: {
              label: "thumbnail",
              hidden: true,
              value: product.thumbnail,
            },
            images: {
              label: "images",
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
      />
    );
  }, [loading, columns]);

  return ProductTable;
};

export default ProductTable;
