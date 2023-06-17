const uniqueFieldError = async (response, formData) => {
  const body = await response.text();

  // Check if the response body contains "Duplicate field"
  if (body.search("Duplicate field") !== -1) {
    const field = body.split(":")[1].trim();
    // If it does, return it along with its value
    return { field, value: formData[`${field}`] };
  }

  // Else return false
  return false;
};

export default uniqueFieldError;
