import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Order = () => {
  const { orderId } = useParams();
  const { data } = useFetch(`http://localhost:4000/api/v1/orders/${orderId}`);
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Order;
