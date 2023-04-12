import { useParams } from "react-router-dom";

// project import
import useFetch from "../../../hooks/useFetch";
import ProductDetails from "./ProductDetails";

const Product = () => {
  const { productId } = useParams();
  const productData = useFetch(`https://dummyjson.com/products/${productId}`);
  return <ProductDetails {...productData} />;
};

export default Product;
