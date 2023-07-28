import { useState } from "react";
import { useParams } from "react-router-dom";

// project import
import CustomerDetail from "./CustomerDetail";
import useFetch from "../../../hooks/useFetch";

const Customer = () => {
  const { customerId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // State to force reload on data update
  const [reload, setReload] = useState();

  const customer = useFetch(`${API_ENDPOINT}customers/${customerId}`, reload);

  return <CustomerDetail {...customer} reload={() => setReload()} />;
};

export default Customer;
