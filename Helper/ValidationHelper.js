const { Validator } = require("node-input-validator");

const validationFunction = async (userInput, validationRules) => {
  const validator = new Validator(userInput, validationRules);

  const isValid = await validator.check();
  if (!isValid) {
    const [firstErrorKey] = Object.keys(validator.errors);
    return validator.errors[firstErrorKey]?.message || "Validation failed";
  }

  return null;
};

module.exports = validationFunction;
