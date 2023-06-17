import { useParams } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";

const Customer = () => {
  const { customerId } = useParams();
  const { loading, error, data } = useFetch(
    `http://localhost:4000/api/v1/customers/${customerId}`
  );
  return JSON.stringify(data, null, 2);
};

export default Customer;
