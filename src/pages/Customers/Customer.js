import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Customer = () => {
  const { customerId } = useParams();
  const { data } = useFetch(
    `http://localhost:4000/api/v1/customers/${customerId}`
  );
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Customer;
