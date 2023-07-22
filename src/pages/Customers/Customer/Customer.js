import { useParams } from "react-router-dom";

// project import
import CustomerDetail from "./CustomerDetail";
import useFetch from "../../../hooks/useFetch";

const Customer = () => {
  const { customerId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;
  const customer = useFetch(`${API_ENDPOINT}customers/${customerId}`);

  return <CustomerDetail {...customer} />;
};

export default Customer;
