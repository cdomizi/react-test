import * as yup from "yup";
import checkUniqueField from "../../utils/checkUniqueField";

const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

// Create new product
const handleCreateProduct = async (formData) => {
  const response = await fetch(`${API_ENDPOINT}products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return product name to display on new product confirmation message
    const productTitle = data?.title;
    return productTitle;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Edit product
const handleEditProduct = async (formData) => {
  // This specific API requires `id` to be of type String
  formData.id = String(formData.id);

  const response = await fetch(`${API_ENDPOINT}products/${formData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return product name to display on edit confirmation message
    const productTitle = data?.title;
    return productTitle;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Delete product
const handleDeleteProduct = async (productId) => {
  const response = await fetch(`${API_ENDPOINT}products/${productId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    // Return product name to display on delete confirmation message
    const productTitle = data?.title;
    return productTitle;
  } else {
    const error = await response;
    return error;
  }
};

// If an empty string is provided, convert it to `null`
const convertToNull = (value) => (value === "" ? null : parseFloat(value));

// Form validation schema
const productSchema = yup
  .object()
  .shape({
    title: yup.string().required("This field cannot be empty"),
    brand: yup.string().notRequired(),
    category: yup.string().notRequired(),
    rating: yup
      .number()
      .min(1, "Please enter a number between 1 and 5")
      .max(5, "Please enter a number between 1 and 5")
      .typeError("Please enter a number")
      .notRequired()
      .transform((event, value) => convertToNull(value)),
    price: yup
      .number()
      .min(0, "Price must be at least 0")
      .typeError("Please enter a number")
      .notRequired()
      .transform((event, value) => convertToNull(value)),
    discountPercentage: yup
      .number()
      .moreThan(0, "Discount must be > 0")
      .max(100, "Enter a valid discount percentage")
      .typeError("Please enter a number")
      .notRequired()
      .transform((event, value) => convertToNull(value)),
    stock: yup
      .number()
      .integer("Please enter a whole number")
      .positive("Please enter a valid stock amount")
      .typeError("Please enter a number")
      .notRequired()
      .transform((event, value) => convertToNull(value)),
    description: yup.string().notRequired(),
    thumbnail: yup.string().url("Please enter a valid URL").notRequired(),
    images: yup
      .array()
      .of(yup.string().url("Please enter a valid URL"))
      .notRequired(),
  })
  .required();

export {
  handleCreateProduct,
  handleEditProduct,
  handleDeleteProduct,
  productSchema,
};
