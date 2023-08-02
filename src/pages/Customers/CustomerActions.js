import * as yup from "yup";
import checkUniqueField from "../../utils/checkUniqueField";

const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

// Create new customer
const handleCreateCustomer = async (formData) => {
  const response = await fetch(`${API_ENDPOINT}customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return customer name to display on new customer confirmation message
    const customerName = `${data?.firstName} ${data?.lastName}`;
    return customerName;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Edit customer
const handleEditCustomer = async (formData) => {
  // This specific API requires `id` to be of type String
  formData.id = String(formData.id);

  const response = await fetch(`${API_ENDPOINT}customers/${formData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return customer name to display on edit confirmation message
    const customerName = `${data?.firstName} ${data?.lastName}`;
    return customerName;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Delete customer
const handleDeleteCustomer = async (customerId) => {
  const response = await fetch(`${API_ENDPOINT}customers/${customerId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    // Return customer name to display on delete confirmation message
    const customerName = `${data?.firstName} ${data?.lastName}`;
    return customerName;
  } else {
    const error = await response;
    return error;
  }
};

// Form validation schema
const customerSchema = yup
  .object()
  .shape({
    firstName: yup.string().required("This field cannot be empty"),
    lastName: yup.string().required("This field cannot be empty"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("This field cannot be empty"),
    address: yup.string().required("This field cannot be empty"),
  })
  .required();

export {
  handleCreateCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
  customerSchema,
};
