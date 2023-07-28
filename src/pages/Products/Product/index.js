import { useParams } from "react-router-dom";

// project import
import useFetch from "../../../hooks/useFetch";
import ProductDetail from "./ProductDetail";

const Product = () => {
  const { productId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;
  const product = useFetch(`${API_ENDPOINT}products/${productId}`);

  return <ProductDetail {...product} />;
};

export default Product;
