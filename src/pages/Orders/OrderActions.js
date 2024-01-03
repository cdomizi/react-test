import jsPDF from "jspdf";
import checkUniqueField from "utils/checkUniqueField";

const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

// Create new order
const handleCreateOrder = async (formData) => {
  const response = await fetch(`${API_ENDPOINT}orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return order ID to display on new order confirmation message
    const orderId = `Order #${data?.id}`;
    return orderId;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Edit order
const handleEditOrder = async (formData) => {
  // This specific API requires `id` to be of type String
  formData.id = String(formData.id);

  const response = await fetch(`${API_ENDPOINT}orders/${formData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    // Return order ID to display on edit confirmation message
    const orderId = `Order #${data?.id}`;
    return orderId;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Delete order
const handleDeleteOrder = async (orderId) => {
  const response = await fetch(`${API_ENDPOINT}orders/${orderId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    // Return order name to display on delete confirmation message
    const orderTitle = `Order #${data?.id}`;
    return orderTitle;
  } else {
    const error = await response;
    return error;
  }
};

// Get id from formData item
const getItemId = (item) => parseInt(item.id);

const getSubmitData = (formData) => ({
  // Pass `id` property if available (i.e. on edit)
  ...(formData.id && { id: formData.id }),
  customerId: getItemId(formData.customer),
  products: formData.products.map((product) => ({
    id: getItemId(product.product),
    quantity: parseInt(product.quantity),
  })),
  invoice: !!formData.invoice,
});

// Create invoice
const handleCreateInvoice = async (formData) => {
  // This specific API requires `id` to be of type String
  formData.id = String(formData.id);

  const response = await fetch(`${API_ENDPOINT}orders/${formData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData }),
  });

  if (response.ok) {
    const data = await response.json();
    // Return invoice ID to display on edit confirmation message
    const orderId = `Invoice #${data?.invoice?.id}`;
    return orderId;
  } else {
    // Check if the user entered a duplicate value for a unique field
    const uniqueField = checkUniqueField(response, formData);
    // If it's not a uniqueFieldError, return a generic error
    return uniqueField ?? response;
  }
};

// Get invoice status for the order
const getInvoiceStatus = (invoice) => {
  const status =
    new Date() > new Date(invoice?.paymentDue)
      ? "overdue"
      : invoice?.paid
      ? "paid"
      : "pending";
  return invoice ? status : null;
};

// Set text color based on invoice status
const setInvoiceColor = (invoice) => {
  const status = getInvoiceStatus(invoice);
  return status === "paid"
    ? "success.main"
    : status === "pending"
    ? "warning.main"
    : "error.main";
};

// Download the order invoice
const printInvoice = (invoiceTemplateRef, idNumber) => {
  // Create the PDF object
  const doc = new jsPDF("p", "mm", "a4", true);
  // Set PDF document properties
  doc.setDocumentProperties({
    title: `Invoice-${idNumber}`,
    subject: "Invoice for your order",
    author: "myERP",
    creator: "myERP",
  });

  // Set content from the invoice template HTML
  doc.html(invoiceTemplateRef, {
    callback: function (doc) {
      // Open the invoice PDF in another tab
      doc.output("dataurlnewwindow", { filename: `Invoice-${idNumber}` });
    },
    autoPaging: "text",
    html2canvas: { scale: 0.2395 },
    margin: [10, 10, 10, 10],
    x: 0,
    y: 0,
  });
};

export {
  getInvoiceStatus,
  getSubmitData,
  handleCreateInvoice,
  handleCreateOrder,
  handleDeleteOrder,
  handleEditOrder,
  printInvoice,
  setInvoiceColor,
};
