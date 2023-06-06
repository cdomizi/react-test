const formValidation = (props) => {
  const validateFields = (field) => {
    let rules = {};
    // Required
    if (field?.required) rules.required = "This field cannot be empty";
    // Type string
    if (field?.type === "string")
      rules = {
        string: (v) => typeof v === "string",
        message: "Input must be a string",
      };
    // String minimum length
    if (field?.type?.minLength)
      rules = {
        minLength: {
          value: field.minLength,
          message: `Input must be at least ${field.minLength} characters long`,
        },
      };
    // String maximum length
    if (field?.type?.maxLength)
      rules = {
        maxLength: {
          value: field.maxLength,
          message: `Input must be at least ${field.maxLength} characters long`,
        },
      };
    // Type number
    if (field?.type === "number")
      rules = {
        number: (v) => !!Number(v),
        valueAsNumber: true,
        message: "Input must be a number",
      };
    // Minimum number
    if (field?.min)
      rules = {
        min: field.type?.min,
        valueAsNumber: true,
        message: `Value must be greater than ${field.min}`,
      };
    // Maximum number
    if (field?.type?.max)
      rules = {
        max: field.max,
        valueAsNumber: true,
        message: `Value must be less than ${field.max}`,
      };
    // Type integer
    if (field?.type === "integer")
      rules = {
        integer: (v) => Number.isInteger(v),
        setValueAs: (v) => parseInt(v),
        message: "Input must be an integer",
      };
    // Type positive integer
    if (field?.type === "positiveInteger")
      rules = {
        positiveInteger: (v) => Number.isInteger(Number(v)) && parseInt(v) > 0,
        setValueAs: (v) => parseInt(v),
        message: "Input must be a positive integer",
      };
    // Type float
    if (field?.positiveFloat)
      rules = {
        float: (v) => !!Number(v),
        setValueAs: (v) =>
          field.positiveFloat === "NONE"
            ? parseFloat(v)
            : parseFloat(v).toFixed(field.positiveFloat),
        message: "Input must be a float",
      };
    // Type positive float
    if (field?.positiveFloat)
      rules = {
        float: (v) => !!Number(v) && parseFloat(v) > 0,
        setValueAs: (v) =>
          field.positiveFloat === "NONE"
            ? parseFloat(v)
            : parseFloat(v).toFixed(field.positiveFloat),
        message: "Input must be a float",
      };

    return rules;
  };

  return validateFields(props);
};

export default formValidation;
