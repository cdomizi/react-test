import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Order = () => {
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;
  const { orderId } = useParams();
  const { data } = useFetch(`${API_ENDPOINT}v1/orders/${orderId}`);
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Order;
