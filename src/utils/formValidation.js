const formValidation = (props) => {
  const validateFields = (field) => {
    let rules = {};
    // Required
    if (field?.fieldFormat?.required)
      rules.required = "This field cannot be empty";
    // Type string
    if (field?.fieldFormat?.type === "string")
      rules = {
        ...rules,
        validate: {
          string: (v) => typeof v === "string" || "Please enter a string",
        },
      };
    // String minimum length
    if (field?.fieldFormat?.minLength)
      rules = {
        ...rules,
        minLength: {
          value: field?.fieldFormat?.minLength,
          message: `Input must be at least ${field?.fieldFormat?.minLength} characters long`,
        },
      };
    // String maximum length
    if (field?.fieldFormat?.maxLength)
      rules = {
        ...rules,
        maxLength: {
          value: field?.fieldFormat?.maxLength,
          message: `Input must be at least ${field?.fieldFormat?.maxLength} characters long`,
        },
      };
    // Type number
    if (field?.fieldFormat?.type === "number")
      rules = {
        ...rules,
        validate: {
          number: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            !!Number(v) ||
            "Please enter a number",
        },
      };
    // Minimum number
    if (field?.fieldFormat?.min != null || undefined)
      rules = {
        ...rules,
        validate: {
          min: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            Number(v) > field?.fieldFormat?.min ||
            `Value must be greater than ${field?.fieldFormat?.min}`,
        },
      };
    // Maximum number
    if (field?.fieldFormat?.max != null || undefined)
      rules = {
        ...rules,
        validate: {
          max: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            Number(v) > field?.fieldFormat?.max ||
            `Value must be less than ${field?.fieldFormat?.max}`,
        },
      };
    // Type number within a given range
    if (field?.fieldFormat?.range)
      rules = {
        validate: {
          range: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            (Number(v) >= field?.fieldFormat?.range[0] &&
              Number(v) <= field?.fieldFormat?.range[1]) ||
            `Please enter a value between ${field?.fieldFormat?.range[0]} and ${field?.fieldFormat?.range[1]}`,
        },
      };
    // Type integer
    if (field?.fieldFormat?.type === "integer")
      rules = {
        ...rules,
        validate: {
          integer: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            Number.isInteger(v) ||
            "Please enter a number",
        },
      };
    // Type float
    if (field?.fieldFormat?.type === "float")
      rules = {
        validate: {
          float: (v) =>
            (!field?.fieldFormat?.required && v === "") ||
            parseFloat(v) ||
            "Please enter a decimal number",
        },
      };

    return rules;
  };

  return validateFields(props);
};

export default formValidation;
