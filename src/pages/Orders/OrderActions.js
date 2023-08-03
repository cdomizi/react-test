import jsPDF from "jspdf";
import checkUniqueField from "../../utils/checkUniqueField";

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

// Edit invoice
const handleEditInvoice = async (invoiceId, paid) => {
  const response = await fetch(`${API_ENDPOINT}invoices/${invoiceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paid }),
  });

  if (response.ok) {
    const data = await response.json();
    // Return invoice name to display on edit confirmation message
    const invoiceTitle = `Invoice #${data?.id}`;
    return invoiceTitle;
  } else {
    const error = await response;
    return error;
  }
};

// Delete invoice
const handleDeleteInvoice = async (invoiceId) => {
  const response = await fetch(`${API_ENDPOINT}invoices/${invoiceId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    // Return invoice name to display on delete confirmation message
    const invoiceTitle = `Invoice #${data?.id}`;
    return invoiceTitle;
  } else {
    const error = await response;
    return error;
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

const setInvoiceColor = (invoice) => {
  const status = getInvoiceStatus(invoice);
  return status === "paid"
    ? "success.main"
    : status === "pending"
    ? "warning.main"
    : "error.main";
};

// Print the order invoice
const printInvoice = (invoiceTemplateRef, idNumber) => {
  const doc = new jsPDF("p", "mm", "a4", true);
  doc.setDocumentProperties({
    title: `Invoice-${idNumber}`,
    subject: "Invoice for your order",
    author: "myERP",
    creator: "myERP",
  });
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 1 }));

  doc.html(invoiceTemplateRef, {
    callback: function (doc) {
      // doc.save(`Invoice-${idNumber}`);
      doc.output("dataurlnewwindow", { filename: `Invoice-${idNumber}` });
    },
    autoPaging: true,
    html2canvas: { scale: 0.2644 },
    x: 0,
    y: 0,
  });

  doc.restoreGraphicsState();
};

export {
  handleCreateOrder,
  handleEditOrder,
  handleDeleteOrder,
  getSubmitData,
  handleCreateInvoice,
  handleEditInvoice,
  handleDeleteInvoice,
  getInvoiceStatus,
  setInvoiceColor,
  printInvoice,
};
