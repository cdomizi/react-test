import { useEffect, useState, useMemo, memo } from "react";

// project import
import useFetch from "../../hooks/useFetch";
import DataTable from "../../components/DataTable";

const ProductTable = memo(() => {
  const [products, setProducts] = useState(null);

  // fetch data from external api
  const { loading, error, data } = useFetch("https://dummyjson.com/products");

  useEffect(() => {
    setProducts(data?.products);
  }, [data]);

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
        error={error}
      />
    );
  }, [loading, error, columns]);

  return ProductTable;
});

export default ProductTable;
