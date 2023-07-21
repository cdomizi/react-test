import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Customer = () => {
  const { customerId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  const { data } = useFetch(`${API_ENDPOINT}customers/${customerId}`);
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default Customer;
