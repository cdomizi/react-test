import { useParams } from "react-router-dom";

// project import
import useFetch from "../../../hooks/useFetch";
import ProductDetail from "./ProductDetail";

const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useFetch(
    `http://localhost:4000/api/v1/products/${productId}`
  );
  return <ProductDetail loading={loading} error={error} data={data} />;
};

export default Product;
