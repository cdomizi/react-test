import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// project import
import useFetch from "hooks/useFetch";
import CustomerDetail from "./CustomerDetail";

const Customer = () => {
  const { customerId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // State to force reload on data update
  const [reload, setReload] = useState();

  // Fetch customer data from API
  const customer = useFetch(`${API_ENDPOINT}customers/${customerId}`, reload);

  const { state } = useLocation();
  const navigate = useNavigate();

  // Prevent direct access
  useEffect(() => {
    if (!state) {
      // Redirect to customers' page on direct access
      navigate("/customers", { replace: true });
      return;
    }
  }, [navigate, state]);

  if (!state) return null;

  // Get dataName and randomData from location
  const { dataName, randomData } = state || {};

  return (
    <CustomerDetail
      {...customer}
      reload={() => setReload({})}
      dataName={dataName}
      randomData={randomData}
    />
  );
};

export default Customer;
