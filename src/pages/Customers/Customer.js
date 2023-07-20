import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Customer = () => {
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;
  const { customerId } = useParams();
  const { data } = useFetch(`${API_ENDPOINT}v1/customers/${customerId}`);
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Customer;
