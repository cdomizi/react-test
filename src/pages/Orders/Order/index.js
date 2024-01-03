import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Project import
import useFetch from "hooks/useFetch";
import OrderDetail from "./OrderDetail";

const Order = () => {
  const { orderId } = useParams();
  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // State to force reload on data update
  const [reload, setReload] = useState();

  // Fetch order data from API
  const order = useFetch(`${API_ENDPOINT}orders/${orderId}`, reload);

  const { state } = useLocation();
  const navigate = useNavigate();

  // Prevent direct access
  useEffect(() => {
    if (!state) {
      // Redirect to orders' page on direct access
      navigate("/orders", { replace: true });
      return;
    }
  }, [navigate, state]);

  if (!state) return null;

  // Get dataName and randomData from location
  const { dataName, randomData } = state || {};

  return (
    <OrderDetail
      {...order}
      reload={() => setReload({})}
      dataName={dataName}
      randomData={randomData}
    />
  );
};

export default Order;
